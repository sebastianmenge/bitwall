var React = require("react");

require("../../../../../common/vendor/bootstrap-datetimepicker/bootstrap-datetimepicker");

var NumberInput = React.createClass({

  getInitialState: function() {
    var value = this.props.value;
    return {value};
  },

  componentDidMount: function() {
    var node = this.refs.picker.getDOMNode();
    this._datetimepicker = $(node).datetimepicker({
      pickTime: false,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      useCurrent: false,
      defaultDate: this.state.value,
      icons: {
        time: 'fa fa-time',
        date: 'fa fa-calendar',
        up:   'fa fa-chevron-up',
        down: 'fa fa-chevron-down'
      }
    }).on("dp.change",this._onChange);
  },

  componentWillReceiveProps: function (nextProps) {
    var node = this.refs.picker.getDOMNode();
    var data = $(node).data("DateTimePicker");
    if (nextProps.minDate) data.setMinDate(nextProps.minDate);
    if (nextProps.maxDate) data.setMaxDate(nextProps.maxDate);
    if (nextProps.value) data.setDate(nextProps.value);
  },

  _onChange: function(e) {
    var value = e.date.toDate();
    if (!this.state.value || value.toString()!==this.state.value.toString()) this.setState({value}, this._notify);
  },

  _notify: function() {
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    };
  },

  _onRemove: function() {
    this._datetimepicker.data("DateTimePicker").setDate('');
    this.setState({value:null}, this._notify);
  },

  render: function() {
    var removeEl = this.props.hideRemove ? null : (
      <span className="input-group-addon" onClick={this._onRemove}>
        <span className="fa fa-times"></span>
      </span>
      );

    return (
      <div className='input-group date-input' ref="picker">
        <span className="input-group-addon datepickerbutton">
          <span className="fa fa-calendar"></span>
        </span>
        <input type='text' className="form-control datepickerbutton" data-date-format="MMM Do, YYYY" ref="dateInput"/>
        {removeEl}
      </div>
    );
  }
});

module.exports = NumberInput;
