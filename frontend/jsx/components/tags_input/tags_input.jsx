var React = require("react")
    _ = require("underscore");

require("selectize");

var TagsInput = React.createClass({

  getInitialState: function() {
    return {value: this.props.value};
  },

  componentDidMount: function() {
    var node = this.refs.picker.getDOMNode();
    this._selectize = $(node).selectize({
        persist: false,
        createOnBlur: true,
        create: true,
        valueField: 'value',
        labelField: 'value',
        searchField: 'value',
        options: _.map(this.props.options, function (e) {return {value: e}}),
        onOptionAdd: this._onOptionAdd
      })
    this._selectize.on("change", this._onChange)
  },

  _onOptionAdd: function (value, test) {
    this.props.options.push(value)
  },

  _onChange: function(e) {
    console.log('change');
    this.setState({value: e.target.value}, this._notify);
  },

  _notify: function() {
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    };
  },

  render: function() {
    return (
      <input type="text" id="input-tags" defaultValue={this.state.value} ref="picker"/>
    );
  }
});

module.exports = TagsInput;