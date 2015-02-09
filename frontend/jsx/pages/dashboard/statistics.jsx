var React = require("react"),
    StatisticsList = require("../../components/statistics_list.jsx"),
    Moment = require("moment");

module.exports = React.createClass({
  render: function() {
    return <div>
      <div className="page-title">
        <h1>Your performance in the current month ({Moment().format('MMMM YYYY')})</h1>
      </div>
      <StatisticsList entries={this.props.entries}/>
    </div>
  }
})

