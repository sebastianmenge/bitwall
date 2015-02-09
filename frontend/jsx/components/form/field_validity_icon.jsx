var React = require("react")

var FieldValidityIcon = React.createClass({
  render: function(){
    var field = this.props.field

    if(field.pristine)
      return <span/>

    var content = null

    if(field.validating){
      content = <i className="fa fa-spin fa-spinner"/>
    }else{
      content = field.error === null ? (field.rules.length ? <i className="fa fa-check-circle-o"/> : null) : <i className="fa fa-times-circle-o"/>
    }

    return <span className="form-feedback">{content}</span>
  }
})

module.exports = FieldValidityIcon