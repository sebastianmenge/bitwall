var _ = require("underscore"),
    Promise = require("bluebird"),
    cx = require("react/addons").addons.classSet,
    copy = require("../../util.js").copy,
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    RichTextEditor = require("../rich_text_editor.jsx"),
    Text = require("./text.js"),
    Type = require("./type.jsx")


function createField(fieldSchema, model){
  var field = {
    id: _.uniqueId(),
    validating: false,
    error: null,
    pristine: true,
    rules: fieldSchema.rules||[],
    name: fieldSchema.name,
    opts: fieldSchema.opts,
    formGroupClasses: fieldSchema.formGroupClasses||{},
    label: fieldSchema.name,
    labelValue: fieldSchema.labelValue,
    hintValue: fieldSchema.hintValue,
    type: fieldSchema.type || Type.text(),
    linked: fieldSchema.linked == true, // TODO: is this still needed?
    readonly: fieldSchema.readonly == true,
    autofocus: fieldSchema.autofocus == true,
    hidden: fieldSchema.hidden == true,
    caption: fieldSchema.caption,
    captionDetail: fieldSchema.captionDetail,
    model: model,
    onChange: fieldSchema.onChange,
    ref: fieldSchema.ref
  }

  if(_.isArray(fieldSchema.type)){
    field.value = _.map(model[field.name], function(entry){
      return createFields(field.type, entry)
    })
  }else{
    field.value = (field.linked ? (model.links ? model.links[field.name] : null) : model[field.name])
  }

  field.defaultValue = fieldSchema.defaultValue

  if(field.defaultValue === undefined){
    if(field.type.name == "text" || field.type.name == "upperCaseText")   field.defaultValue = ""
    else if (_.isArray(field.type)) field.defaultValue = []
  }

  if(field.value === null || field.value === undefined)
    field.value = field.defaultValue

  if(field.value === undefined)
    field.value = null


  var initial = copy(model[field.name])

  // TODO: workaround for dirty checking until HTML-Janitor sanitizer can be used here
  if(field.type.name == "richText") {
    initial = RichTextEditor.sanitize(initial);
  }

  field.initialValue = initial

  return field
}

function createFields(schema, model){
  return _.map(schema, function(fieldSchema){
    return createField(fieldSchema, model)
  })
}

function serialize(fields, nested){
  return _.inject(fields, function(memo, field){

    if(_.isArray(field.type)){
      memo[field.name] = _.map(field.value, function(valueField){
        return serialize(valueField, true)
      })
    }else{
      if(_.isObject(field.value)){
        memo[field.name] = _.omit(field.value, "links", "ui")
      }else{
        memo[field.name] = field.value
      }
    }

    return memo
  }, {})
}

function flattenFields(fields, arr){
  if(!arr)
    arr = []

  _.each(fields, function(field){
    arr.push(field)
    if(_.isArray(field.type)){
      _.each(field.value, function(valueField){
        flattenFields(valueField, arr)
      })
    }
  })

  return arr
}


var FormBase = {

  getFormGroupClasses: function(field){
    return cx(_.extend({
      "form-group": true,
      "has-error": field.error
    }, field.formGroupClasses))
  },

  getInitialState: function(props){
    props = props || this.props;
    return {fields: createFields(props.schema, copy(props.model||{}))}
  },

  inputControlFor: function(field){
    if(field.readonly){
      if(field.type.readonly){
        return <span>{field.type.readonly.apply(this, [field, field.type.opts])}</span>
      }else{
        return <span>{field.value}</span>
      }
    }

    return field.type.inputControl.apply(this, [field, field.type.opts])
  },

  labelForField: function(field, parentField){
    if(field.labelValue !== null && field.labelValue !== undefined)
      return field.labelValue

    return Text(this.props.type+(parentField ? "." + parentField.name : "")+"."+field.name+".label")
  },

  hintForField: function(field, parentField){
    if(field.hintValue !== null && field.hintValue !== undefined)
      return field.hintValue

    return Text(this.props.type+(parentField ? "." + parentField.name : "")+"."+field.name+".hint")
  },

  // take mc-question-show form. options are getting created async so the model updates afterwards
  componentWillReceiveProps: function(nextProps) {
    if (!_.isEqual(nextProps.model, this.props.model)) {
      this.setState(this.getInitialState(nextProps));
    }
  },

  componentDidUpdate: function() {
    if (this._nextAutofocus) {
      var field = this.refs[this._nextAutofocus]
      if (!field) {
        console.warn("expected to autofocus '"+this._nextAutofocus+"'' but could find no field with such ref");
      }
      else {
        field.getDOMNode().focus();
      }
      this._nextAutofocus = null;
    }
  },

  setValue: function(field, newValue){
    field.value = newValue
    field.pristine = false

    this.validate(false).then(function(){
      // valid
    }).catch(function(){
      // invalid
    })

    if(field.onChange)
      field.onChange(newValue)

    if(this.isMounted()) // can be called async e.g. file upload
      this.forceUpdate()
  },

  onAdd: function(field, model, e){
    autofocusField = _.find(field.type, (t)=>(t.opts||{}).autofocusOnAdd);
    if (autofocusField) {
      autofocusField.ref = 'field-'+_.uniqueId();
      this._nextAutofocus = autofocusField.ref;
    }
    this.setValue(field, _.union(field.value, [createFields(field.type, model)]))
    return false
  },

  onRemove: function(field, value, e){
    this.setValue(field, _.without(field.value, value))
    return false
  },

  onChange: function(field, e){
    this.setValue(field, field.type.convertValue(field, field.type.opts, e))
    return false
  },

  onSubmit: function(){
    this.submit()
    return false
  },

  submit: function(){
    Dispatcher.handleViewAction({type: "PROCESSING_START"})

    return this.validate(true)
    .bind(this)
    .then(function(){
      var res = this.props.onSubmit(serialize(this.state.fields))

      _.each(flattenFields(this.state.fields), function(field){
        field.initialValue = copy(field.value)
      })

      if(this.didValidSubmit)
        this.didValidSubmit()

      return Promise.resolve()
    })
    .catch(function(err){
      if(this.didInvalidSubmit)
        this.didInvalidSubmit()
      Dispatcher.handleViewAction({type: "PROCESSING_ERROR"})
      console.info("err", err)
    })
    .finally(function(){
    })
  },

  reset: function(){
    return _.any(flattenFields(this.state.fields), function(field){
      if(field.pristine)
        return false

      if(_.isArray(field.value)){
        // TODO: implement this
      }else{
        field.value = field.initialValue
      }
    })
  },

  isDirty: function(){
    var res = _.any(flattenFields(this.state.fields), function(field){
      if(field.pristine)
        return false

      if(_.isArray(field.value)) // TODO: handle me properly
        return false

      var newValue = field.value
      var initialValue = field.initialValue

      // TODO: we still have some issues in (de)serializing createdAt date fields

      if(_.isObject(newValue) && newValue.id)
        newValue = _.omit(newValue, "createdAt")

      if(_.isObject(initialValue) && initialValue.id)
        initialValue = _.omit(initialValue, "createdAt")

      var r = !_.isEqual(newValue, initialValue)

      if(r)
        console.info("dirty",field.name,field.value,field.initialValue)

      return r
    }, this)

    return res
  },

  validate: function(validatePristine){
    var fields = flattenFields(this.state.fields)
    var validations = _.map(fields, function(field){

      if(field.pristine && !validatePristine)
        return Promise.resolve()

      field.error = null
      field.validating = true
      field.pristine = false

      return Promise
      .all(_.map(field.rules, function(rule){
        return rule(field.value)
      }))
      .catch(function(err){
        field.error = err
        return Promise.reject(err)
      })
      .finally(function(){
        field.validating = false
      })
    })


    return Promise
    .all(validations)
    .bind(this)
    .finally(function(){
      if(this.isMounted())
        this.forceUpdate()
    })
  }

}

FormBase.createFields = createFields

module.exports = FormBase
