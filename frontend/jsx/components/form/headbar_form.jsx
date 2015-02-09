var React = require("react"),
    _ = require("underscore"),
    cx = require("react/addons").addons.classSet,
    copy = require("../../util.js").copy,
    FormBase = require("./form_base.jsx"),
    SubmitButton = require("./submit_button.jsx"),
    FieldValidityIcon = require("./field_validity_icon.jsx")

var HeadbarForm = React.createClass({
  mixins: [FormBase],

  componentWillReceiveProps: function(nextProps){
    this.setState({fields: FormBase.createFields(nextProps.schema, copy(nextProps.model||{}))})
  },

  renderFields: function(fields){
    return _.map(fields, function(field){
      var errorMessage = field.error ? <span className="help-block">{field.error}</span> : null,
          label = field.name ? <label className="control-label">{field.name}</label> : null

      return <div key={field.id} className={this.getFormGroupClasses(field)}>
        {label}
        {this.inputControlFor(field)}
        {errorMessage}
        <FieldValidityIcon field={field}/>
      </div>
    }, this)
  },

  render: function(){

    return <form role="form" className="form-inline ebe-form ui-input-form" onSubmit={this.onSubmit}>
      {this.renderFields(this.state.fields)}
      <SubmitButton label={this.props.buttonLabel}/>
    </form>
  }
})

module.exports = HeadbarForm
