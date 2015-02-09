var React = require("react"),
    _ = require("underscore"),
    cx = require("react/addons").addons.classSet,
    SortContainer = require("../sort/sort_container.jsx"),
    SortItem = require("../sort/sort_item.jsx"),
    FormBase = require("./form_base.jsx"),
    Text = require("./text.js"),
    FieldValidityIcon = require("./field_validity_icon.jsx"),
    PickAndAdd = require("./pick_and_add.jsx"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    SubmitButton = require("./submit_button.jsx")

var Form = React.createClass({
  mixins: [FormBase],

  didValidSubmit: function(){
    Dispatcher.handleViewAction({type: "ALERT_SUCCESS", message: "All changes were saved correctly!"})
  },

  didInvalidSubmit: function(){
    Dispatcher.handleViewAction({type: "ALERT_ERROR", message: "Something went wrong!"})
  },

  renderListFields: function(parentField){
    return _.map(parentField.value, function(fieldArr, idx){
      var columns = _.map(_.select(fieldArr, function(e){ return !e.hidden }), function(field){
        var errorMessage = field.error ? <span className="help-block">{field.error}</span> : null
        var inputControl = this.inputControlFor(field)
        var tdClasses = cx({
          "expand": (field.opts||{}).expand,
        });

        return <td className={tdClasses} key={field.id}><div className={this.getFormGroupClasses(field)}>{inputControl}{errorMessage}</div></td>
      }, this)

      return <SortItem domType="tr" key={idx} id={fieldArr}>
        <td className="draggable"><i className="fa fa-bars"/></td>
        {columns}
        <td className="actions"><a onClick={this.onRemove.bind(this, parentField, fieldArr)}><i className="fa fa-trash-o fa-color-red"/></a></td>
      </SortItem>

    }, this)
  },

  renderFieldAddableList: function(field){
    var headerColumns = _.map(_.select(field.type, function(e){ return !e.hidden }), function(nestedSchema, idx){
      return <th key={idx} dangerouslySetInnerHTML={{__html: this.labelForField(nestedSchema, field)}}></th>
    }, this)

    var dataRows = this.renderListFields(field);

    var dragEndHandler = function(res) {
      res.sortArray(field.value,{inlineSorting:true,idProp: function(item,id){return item===id;}});
      this.forceUpdate();
    }

    var table = null;
    if (dataRows.length) {
      table = <table className="table list-view" cellPadding="0" cellSpacing="0">
          <thead>
            <th>&nbsp;</th>
            {headerColumns}
            <th>&nbsp;</th>
          </thead>
          <SortContainer onDragEnd={dragEndHandler.bind(this)} domType="tbody" colSpan={headerColumns.length+2}>
            {dataRows}
          </SortContainer>
        </table>;
    }

    return <div>
      <div className="form-list-view">
        {table}
        <button type="button" className="btn btn-secondary-action" onClick={this.onAdd.bind(this, field, {})}>Add a new entry</button>
      </div>
    </div>
  },

  renderFieldPickableList: function(field){
    var headerColumns = _.map(_.select(field.type, function(e){ return !e.hidden }), function(nestedSchema, idx){
      return <th key={idx} dangerouslySetInnerHTML={{__html: this.labelForField(nestedSchema, field)}}></th>
    }, this)

    var dataRows = this.renderListFields(field)
        // <button className="btn btn-secondary-action" onClick={this.onAdd.bind(this, field, {})}>Add Entry</button>

    var dragEndHandler = function(res) {
      res.sortArray(field.value,{inlineSorting:true,idProp: function(item,id){return item===id;}});
      this.forceUpdate();
    }

    var table = null;
    if (dataRows.length) {
      table = <div className="form-list-view">
        <table className="table list-view" cellPadding="0" cellSpacing="0">
          <thead>
            <th>&nbsp;</th>
            {headerColumns}
            <th>&nbsp;</th>
          </thead>
          <SortContainer onDragEnd={dragEndHandler.bind(this)} domType="tbody" colSpan={headerColumns.length+2}>
            {dataRows}
          </SortContainer>
        </table>
      </div>;
    }

    return <div>
      <div className="input-button-group">
        <PickAndAdd field={field} onAdd={this.onAdd} label={field.opts.label}/>
      </div>
      {table}
    </div>
  },

  renderFields: function(fields){
    var nonHiddenFields = _.select(fields, function(e){ return !e.hidden })

    return _.map(nonHiddenFields, function(field){
      var errorMessage = field.error ? <p className="input-description">{field.error}</p> : null
      var inputControl = null

      if(_.isArray(field.type)){

        if(field.opts.style == "pick")
          inputControl = this.renderFieldPickableList(field);
        else if (field.opts.style == "addable")
          inputControl = this.renderFieldAddableList(field);

      }else{
        inputControl = this.inputControlFor(field)
      }

      var caption = field.caption ? <h1 className="form-caption">{field.caption}</h1> : null,
          captionDetail = field.captionDetail ? <p className="form-caption-detail" dangerouslySetInnerHTML={{__html: field.captionDetail}}></p> : null

      var hint = this.hintForField(field) ? <p className="input-description" dangerouslySetInnerHTML={{__html: this.hintForField(field)}}></p> : null

      return <div key={field.id} className={caption || captionDetail ? "with-caption" : null}>
        {caption}
        {captionDetail}
        <div className={this.getFormGroupClasses(field)}>
          <div className="col-xs-4 form-label">
            <label className="control-label" dangerouslySetInnerHTML={{__html: this.labelForField(field)}}></label>
            {errorMessage}
            {hint}
          </div>
          <div className="col-xs-8 form-input">
            {inputControl}
            <FieldValidityIcon field={field}/>
          </div>
        </div>
      </div>

      throw "unsupported"

    }, this)
  },

  componentWillReceiveProps: function(next){
    _.each(next.schema, function(f){
      var field = _.where(this.state.fields, {name: f.name})[0]
      field.readonly = f.readonly
    }, this)
  },

  render: function(){
    var items = this.renderFields(this.state.fields)

    return <form role="form" className="form-horizontal ebe-form" onSubmit={this.onSubmit}>
      {items}
      <div className="form-actions">
        {this.props.unsubmittable ? null: <SubmitButton label={this.props.buttonLabel}/>}
      </div>
    </form>
  }

})

module.exports = Form
