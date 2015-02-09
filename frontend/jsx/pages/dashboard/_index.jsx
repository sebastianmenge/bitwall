var React = require("react"),
    _ = require("underscore"),
    Link = require("react-router").Link,
    PageContext = require("../../mixins/page_context.js"),
    TodoList = require("../../components/todo_list.jsx"),
    Statistics = require("./statistics.jsx"),
    FirstSteps = require("./first_steps.jsx"),
    Util = require("../../util"),
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js");

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Course)],

  getStoreState: function(){
    return {courses: Store.Course.getCourses()}
  },

  render: function(){

    var {educator} = this.props,
        {courses} = this.state;

    var todos = [
      {label: "Quickly get your content on the road",                                    route: "courses",          linkLabel: "Create a course"},
      {label: "Import and display the feedback of your customers",  route: "testimonials",   linkLabel: "Create a testimonial profile"},
      {label: "Easily change the appearance of the welcome page of your website",               route: "website/show",     linkLabel: "Customize your welcome page"},
      {label: "Manage your custom domains using our domain manager",  route: "website/domain",   linkLabel: "Add your own domain"},
      {label: "Fill in your account information details",  route: "settings/account_data",   linkLabel: "Provide the account details"},
      {label: "Provide all the information needed to pay you",  route: "settings/payout_info",   linkLabel: "Add your payout information"}
    ]

    var statistics = [
      {label: "Unique visitors", value: educator.numVisits},
      {label: "Users signed up", value: educator.numSignups},
      {label: "Course enrollments<br/>(free + paid)", value: educator.numOrders},
      {label: "Gross revenue", value: Util.formatMoney(educator.revenue, educator.defaultCurrency)},
    ]

    var hasPublishedOneCourse = _.some(courses, function(course) { return course.published === true; }),
        topSection = hasPublishedOneCourse ? <Statistics entries={statistics}/> : <FirstSteps educator={educator}/>;

    return <div>
      {topSection}
      <div className="page-title">
        <h1>Get started with your Patience platform!</h1>
      </div>
      <TodoList entries={todos}/>
    </div>
  }
})
