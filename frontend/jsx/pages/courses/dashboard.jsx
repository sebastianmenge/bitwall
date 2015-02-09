var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    TodoList = require("../../components/todo_list.jsx"),
    StatisticsList = require("../../components/statistics_list.jsx"),
    Moment = require("moment"),
    req = require("../../stores/lib/req.js"),
    Util = require("../../util")

module.exports = React.createClass({
  mixins: [PageContext],

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  render: function(){

    var {course, educator, statistic} = this.props
    var todos = [
      {label: "Optimize the Course Page to attract more students",       route: "courses/show",        params: this.props.params, linkLabel: "Edit the Course Page details"},
      {label: "Add content and manage the curriculum of your course",   route: "courses/curriculum",  params: this.props.params, linkLabel: "Manage the Course Curriculum"},
      {label: "Add extra information & answer the most common questions",                    route: "courses/info",        params: this.props.params, linkLabel: "Add Extra Info & FAQ"},
      {label: "Define the price and offer a free trial",        route: "courses/pricing",     params: this.props.params, linkLabel: "Manage the Pricing Options"}
    ]

    var statistics = [
      {label: "Free trials started", value: statistic.numTrialsCurrentMonth},
      {label: "Course enrollments<br/>(free + paid)", value: statistic.numNonTrialsCurrentMonth},
      {label: "Gross revenue", value: Util.formatMoney(statistic.revenueCurrentMonth, educator.defaultCurrency)}
    ]

    return <div>
      <div className="page-title">
        <h1>Your performance in the current month ({Moment().format('MMMM YYYY')})</h1>
      </div>
      <StatisticsList entries={statistics}/>
      <div className="page-title">
        <h1>Get started with your course</h1>
      </div>
      <TodoList entries={todos}/>
    </div>
  }
})

