/** @jsx React.DOM */

var React = require("react"),
    numeral = require('numeral');

var allFloats = /^-?\d+([.,]\d*)?$/,
    positiveFloats = /^\d+([.,]\d*)?$/,
    allFloatsWithPrecision = function (precision) {return new RegExp("^-?\\d+([.,]\\d{0,"+precision+"})?$");},
    positiveFloatsWithPrecision = function (precision) {return new RegExp("^\\d+([.,]\\d{0,"+precision+"})?$");},
    allDecimals = /^-?\d+?$/,
    positiveDecimals = /^\d+?$/;


var NumberInput = React.createClass({

  getInitialState: function() {
    var value = this.props.value || null;
    //TODO: be more intelligent here
    if (this.props.precision) {
      var zeros = "";
      for (var i=0; i < this.props.precision; i++) zeros+="0";
      value = numeral(value).format("0[.]"+zeros+"");
    }
    if (this.props.onlyDecimal && value) value = parseInt(value,10);
    // `value` is always handled as a string, to avoid weirdness with
    // displaying 12.0001 but actually representing 12.000091234
    return {value: value!==null ? value.toString() : value};
  },

  _isFloat: function() {
    return this.props.precision && this.props.precision>0 || !this.props.onlyDecimal
  },

  _isValid: function(value) {
    if (value==='') return true;
    if (this._isFloat()) {
      if (this.props.onlyPositive) {
        if (this.props.precision) {
          return value.match(positiveFloatsWithPrecision(this.props.precision))
        } else {
          return value.match(positiveFloats)
        }
      } else { // also non-positive numbers
        if (this.props.precision) {
          return value.match(allFloatsWithPrecision(this.props.precision))
        } else {
          return value.match(allFloats)
        }
      }
    } else {// only decimals
      if (this.props.onlyPositive) {
        return value.match(positiveDecimals)
      } else {
        return value.match(allDecimals)
      }
    }
    throw "No regex specified for this use case yet!"
  },

  _onChange: function(e) {
    var value = e.target.value;
    if (this._isValid(value)) this.setState({value}, this._notify);
  },

  _notify: function() {
    if (this.props.onChange) {
      this.props.onChange(this._isFloat() ? parseFloat(this.state.value.replace(',','.')) : parseInt(this.state.value, 10))
    };
  },

  render: function() {

    return <input
        type="text"
        className="form-control"
        value={this.state.value}
        onChange={this._onChange}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        />;
  }
});

module.exports = NumberInput;
