var React = require("react")

module.exports = React.createClass({

  componentDidMount: function() {
    this._resize();
  },

  _resize: function() {
    var field = this.refs.field.getDOMNode();
    if (field.scrollHeight != field.clientHeight) {
      field.style.height = field.scrollHeight + "px";
    }
  },

  _onChange: function(e) {
    if (this.props.onChange) this.props.onChange(e);
    this._resize();
  },
  render: function(){
    return this.transferPropsTo(<textarea ref="field" onChange={this._onChange} className="form-control auto-grow-textarea"/>);
  }
})