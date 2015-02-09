var React = require("react")
    _ = require("underscore"),
    NumberInput = require("./number_input/number_input.jsx");

var unitsToSeconds = {seconds:1,minutes:60,hours:3600,days:3600*24,weeks:3600*24*7}
var DurationInput = React.createClass({

  getInitialState: function() {
    var number = this.props.value;
    var smallesUnitInSeconds = unitsToSeconds[this.props.units[0]];
    if (!number) return {number: 0, unitInSeconds:smallesUnitInSeconds}
    for (var i = this.props.units.length - 1; i >= 0; i--) {
      var unitInSeconds=unitsToSeconds[this.props.units[i]];
      if (number % unitInSeconds==0) return {number: number/unitInSeconds, unitInSeconds}
    }
    return {number: number/smallesUnitInSeconds, unitInSeconds: smallesUnitInSeconds};
  },

  _onChangeNumber: function(e) {
    this.setState({number: e}, this._notify);
  },

  _onChangeUnit: function(e) {
    this.setState({unitInSeconds: e.target.value}, this._notify);
  },

  _notify: function() {
    if (this.props.onChange) this.props.onChange(this.state.number * this.state.unitInSeconds);
  },

  render: function() {
    var options = _.map(this.props.units, function(u) {
      return <option value={unitsToSeconds[u]}>{u}</option>
    })

    return <div className="input-group">
      <NumberInput 
        onlyDecimal={true}
        onlyPositive={true}
        value={this.state.number}
        onChange={this._onChangeNumber}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        />
      <span className="input-group-addon">
        <select value={this.state.unitInSeconds} onChange={this._onChangeUnit}>{options}</select>
      </span>
    </div>;
  }
});

module.exports = DurationInput;