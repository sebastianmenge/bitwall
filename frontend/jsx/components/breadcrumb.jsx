var React = require("react"),
    _ = require("underscore"),
    Link = require("react-router").Link,
    Store = require("../stores/flux/store.js"),
    PageContextStore = require("../stores/page_context_store.js"),
    StoreState = require("../mixins/store_state.js"),
    AppCfg = require("../app_config.js")

function createBreadcrumb(route, label){
  var labels = {
    "courses": "All Courses",
    "courses/curriculum": "Curriculum",
    "courses/info": "Extra Info & FAQ",
    "courses/pricing": "Pricing Options",
    "courses/dashboard": "Dashboard",
    "quizzes/show": "Quiz",
    "quizzes/questions": "Questions",
    "lectures": "Lectures",
    "textQuestions/show": "Text Question",
    "lectures/attachments": "Attachments",
    "testimonials": "Testimonials",
    "instructors": "Instructors",
    "dashboard": "Dashboard",
    "apps": "App Store",
    "apps/index": "App Store",
    "coupons": "Coupons",
    "coupons/index": "Coupons",
    "website": "Website",
    "website/index": "Website",
    "website/branding": "Branding",
    "website/show": "Welcome Page",
    "website/domain": "Domains",
    "users": "Users",
    "leads": "Leads",
    "orders": "Orders",
    "coupons/new": "Create a new Coupon",
    "settings/index": "Settings",
    "settings/account_data": "Account Data & Billing Information",
    "settings/payout_info": "Payout Details",
    "settings/plan": "Manage your Patience Plan",
    "analytics/index": "Analytics & Reporting",
    "analytics/reporting": "Patience Reporting"
  }

  _.each(AppCfg.entries, function(app){
    labels[app.route] = app.label
  })

  return {label: label || labels[route] || "undefined:"+route, route: route}
}

var Breadcrumb = React.createClass({
  mixins: [StoreState(PageContextStore, Store.Course, Store.Instructor, Store.Testimonial)],

  getStoreState: function(){
    return {
      activeRoute: PageContextStore.getActiveRoute(),
      params: PageContextStore.getParams()
    }
  },

  renderBreadcrumb: function(){
    var breadcrumb = [],
        activeRoute = this.state.activeRoute,
        params = this.state.params

    if(!activeRoute)
      return breadcrumb

    if(activeRoute.match(/^lectures\//)){
      breadcrumb.push(createBreadcrumb("courses"))
      breadcrumb.push(createBreadcrumb("courses/show", Store.Course.getCourse(parseInt(params.courseId)).name))
      breadcrumb.push(createBreadcrumb("courses/curriculum"))
      breadcrumb.push(createBreadcrumb("lectures/show", Store.Course.getLecture(parseInt(params.lectureId)).name))

      if(activeRoute != "lectures/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    } else if(activeRoute.match(/^quizzes\//)){
      breadcrumb.push(createBreadcrumb("courses"))
      breadcrumb.push(createBreadcrumb("courses/show", Store.Course.getCourse(parseInt(params.courseId)).name))
      breadcrumb.push(createBreadcrumb("courses/curriculum"))
      breadcrumb.push(createBreadcrumb("quizzes/show", Store.Course.getQuiz(parseInt(params.quizId)).name))

      if(activeRoute != "quizzes/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^(text|mc)Questions\//)){
      breadcrumb.push(createBreadcrumb("courses"))
      breadcrumb.push(createBreadcrumb("courses/show", Store.Course.getCourse(parseInt(params.courseId)).name))
      breadcrumb.push(createBreadcrumb("courses/curriculum"))
      breadcrumb.push(createBreadcrumb("quizzes/show", Store.Course.getQuiz(parseInt(params.quizId)).name))
      breadcrumb.push(createBreadcrumb("quizzes/questions"))
      if (activeRoute.match(/^textQuestions\/show/)) breadcrumb.push(createBreadcrumb("textQuestions/show", Store.Course.getTextQuestion(parseInt(params.questionId)).question));
      if (activeRoute.match(/^mcQuestions\/show/)) breadcrumb.push(createBreadcrumb("mcQuestions/show", Store.Course.getMcQuestion(parseInt(params.questionId)).question));
    }else if(activeRoute.match(/^courses\//)){
      breadcrumb.push(createBreadcrumb("courses"))
      breadcrumb.push(createBreadcrumb("courses/show", Store.Course.getCourse(parseInt(params.courseId)).name))

      if(activeRoute != "courses/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^testimonials\//)){
      breadcrumb.push(createBreadcrumb("testimonials"))
      breadcrumb.push(createBreadcrumb("testimonials/show", Store.Testimonial.getTestimonial(parseInt(params.testimonialId)).name))

      if(activeRoute != "testimonials/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^instructors\//)){
      breadcrumb.push(createBreadcrumb("instructors"))
      breadcrumb.push(createBreadcrumb("instructors/show", Store.Instructor.getInstructor(parseInt(params.instructorId)).name))

      if(activeRoute != "instructors/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^leads\//)){
      breadcrumb.push(createBreadcrumb("leads"))
    }else if(activeRoute.match(/^users\//)){
      breadcrumb.push(createBreadcrumb("users"))
      breadcrumb.push(createBreadcrumb("users/show", Store.User.getUser(parseInt(params.userId)).ui.fullname))

      if(activeRoute != "users/show")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^orders\//)){
      breadcrumb.push(createBreadcrumb("orders"))
      breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^website\//)){
      breadcrumb.push(createBreadcrumb("website/index"))

      if(activeRoute !== "website/index")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^apps\//)){
      breadcrumb.push(createBreadcrumb("apps/index"))

      if(activeRoute !== "apps/index")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else if(activeRoute.match(/^coupons\//)){
      breadcrumb.push(createBreadcrumb("coupons/index"))

      if(activeRoute !== "coupons/index")
        breadcrumb.push(createBreadcrumb(activeRoute))
    }else{
      breadcrumb.push(createBreadcrumb(activeRoute))
    }

    return _.map(breadcrumb, function(e){
      var isLast = _.last(breadcrumb) === e,
          className = isLast ? "active" : "",
          link = isLast ? e.label : Link(_.extend({to: e.route, key: e.label}, params), e.label)

      return <li key={e.label} className={className}>{link}</li>
    }, this)
  },

  render: function(){
    return <ul className="breadcrumb">
      {this.renderBreadcrumb()}
    </ul>
  }
})

module.exports = Breadcrumb
