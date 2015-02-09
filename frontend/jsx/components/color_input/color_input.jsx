var React = require("react");

require("bootstrap-colorpicker");

var ColorInput = React.createClass({

  getInitialState: function() {
    return {value: this.props.value};
  },

  componentDidMount: function() {
    // this._notify()
    var node = this.refs.picker.getDOMNode();
    this._colorpicker = $(node).colorpicker().on("changeColor", this._onChange)
  },

  _onChange: function(e) {
    this.setState({value: e.color.toHex()}, this._notify);
  },

  _notify: function() {
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    };
  },

  render: function() {
    return (
      <div className='input-group color-input' ref="picker">
        <span className="input-group-addon">
          <i></i>
        </span>
        <input type="text" className="form-control" defaultValue={this.state.value}/>
      </div>

    );
  }
});

module.exports = ColorInput;