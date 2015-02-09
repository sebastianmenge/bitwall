var React = require("react"),
    {Link, ActiveState} = require("react-router"),
    _ = require("underscore"),
    PageContextStore = require("../stores/page_context_store.js"),
    StoreState = require("../mixins/store_state.js"),
    AppCfg = require("../app_config.js"),
    Store = require("../stores/flux/store.js"),
    cloneWithProps = require("react/lib/cloneWithProps.js")


function createBack(route, label){
  var labels = {
    "courses": "All Courses",
    "courses/curriculum": "Curriculum",
    "users": "Users",
    "leads": "Leads",
    "orders": "Orders",
    "instructors": "Instructors",
    "website/index": "Website",
    "apps/index": "App Store",
    "coupons/index": "Coupons",
    "testimonials": "Testimonials",
    "quizzes/questions": "Question List",
    "quizzes/show": "Question List",
    "settings/index": "Settings",
    "analytics/index": "Analytics & Reporting"
  }
  return {label: label||labels[route], route: route}
}


function createSidebar(route, icon, label){
  var labels = {
    "textQuestions/show": "Question Content",
    "mcQuestions/show": "Question Content",
    "textQuestions/new": "New Text Question",
    "mcQuestions/new": "New MC Question",
    "lectures/show": "Lecture Content",
    "lectures/attachments": "Attachments",
    "quizzes/show": "Quiz Content",
    "quizzes/questions": "Questions",
    "courses/dashboard": "Course Dashboard",
    "courses/show": "Course Page",
    "courses/pricing": "Pricing Options",
    "courses/curriculum": "Curriculum",
    "courses/info": "Extra Info & FAQ",
    "testimonials/show": "Testimonial Details",
    "instructors/show": "Instructor Details",
    "users/show": "User Details",
    "courses": "Courses",
    "users": "Users",
    "leads": "Leads",
    "dashboard": "Dashboard",
    "dashboard/index": "Dashboard",
    "orders": "Orders",
    "instructors": "Instructors",
    "coupons": "Coupons",
    "coupons/index": "Coupons",
    "apps": "App Store",
    "apps/index": "App Store",
    "website": "Website",
    "website/index": "Website",
    "website/show": "Welcome Page",
    "website/branding": "Branding",
    "website/domain": "Domains",
    "testimonials": "Testimonials",
    "settings/index": "Settings",
    "settings/account_data": "Account Data",
    "settings/payout_info": "Payout Details",
    "settings/plan": "Patience Plan",
    "analytics/index": "Analytics & Reporting",
    "analytics/reporting": "Patience Reporting"

  }

  _.each(AppCfg.entries, function(app){
    labels[app.route] = app.label
  })

  return {label: label||labels[route], route: route, iconClass: icon.match(/^pa-icon/) ? icon : "fa-"+icon}
}

var Sidebar = React.createClass({
  mixins: [StoreState(PageContextStore, Store.Course, Store.Instructor, Store.Testimonial), ActiveState],

  getStoreState: function(){
    var params = PageContextStore.getParams()

    return {
      activeRoute: PageContextStore.getActiveRoute(),
      params: params,
      course: params.courseId ? Store.Course.getCourse(parseInt(params.courseId, 10)) : null,
      lecture: params.lectureId ? Store.Course.getLecture(parseInt(params.lectureId, 10)) : null,
      instructor: params.instructorId ? Store.Instructor.getInstructor(parseInt(params.instructorId, 10)) : null,
      testimonial: params.testimonialId ? Store.Testimonial.getTestimonial(parseInt(params.testimonialId, 10)) : null
    }
  },

  updateActiveState: function () {
    this.forceUpdate();
  },

  renderSidebarItems: function(){
    var sidebar = [],
        activeRoute = this.state.activeRoute,
        params = this.state.params

    if(!activeRoute)
      return sidebar

    if(activeRoute.match(/^lectures\//)){
      sidebar.push(createSidebar("lectures/show", "book"))
      sidebar.push(createSidebar("lectures/attachments", "paperclip"))
    } else if(activeRoute.match(/^quizzes\//)){
      sidebar.push(createSidebar("quizzes/show", "book"))
      sidebar.push(createSidebar("quizzes/questions", "question"))
    } else if (activeRoute.match(/^textQuestions\/show/)){
      sidebar.push(createSidebar("textQuestions/show", "question"))
    } else if (activeRoute.match(/^textQuestions\/new/)){
      sidebar.push(createSidebar("textQuestions/new", "question"))
    } else if (activeRoute.match(/^mcQuestions\/show/)){
      sidebar.push(createSidebar("mcQuestions/show", "question"))
    } else if (activeRoute.match(/^mcQuestions\/new/)){
      sidebar.push(createSidebar("mcQuestions/new", "question"))
    } else if(activeRoute.match(/^courses\//)){
      sidebar.push(createSidebar("courses/dashboard", "dashboard"))
      sidebar.push(createSidebar("courses/show", "laptop"))
      sidebar.push(createSidebar("courses/curriculum", "list-ul"))
      sidebar.push(createSidebar("courses/info", "info-circle"))
      sidebar.push(createSidebar("courses/pricing", "money"))
    }else if(activeRoute.match(/^testimonials\//)){
      sidebar.push(createSidebar("testimonials/show", "user"))
    }else if(activeRoute.match(/^instructors\//)){
      sidebar.push(createSidebar("instructors/show", "user"))
    }else if(activeRoute.match(/^users\//)){
      sidebar.push(createSidebar("users/show", "user"))
    }else if(activeRoute.match(/^leads\//)){
      // sidebar.push(createSidebar("leads/show", "lead"))
    }else if(activeRoute.match(/^orders\//)){
      sidebar.push(createSidebar("orders/show", "dashboard"))
    }else if(activeRoute.match(/^website\//) && activeRoute !== "website/index"){
      sidebar.push(createSidebar("website/show", "desktop"))
      sidebar.push(createSidebar("website/branding", "certificate"))
      sidebar.push(createSidebar("website/domain", "globe"))
    }else if(activeRoute.match(/^apps\//) && activeRoute !== "apps/index"){
      _.each(AppCfg.entries, function(app){
        sidebar.push(createSidebar(app.route, app.icon))
      })
    }else if(activeRoute.match(/^coupons\//) && activeRoute !== "coupons/index"){
    }else if(activeRoute.match(/^analytics\//) && activeRoute !== "analytics/index"){
      sidebar.push(createSidebar("analytics/reporting", "pa-icon-patience-reporting"))
    }else if(activeRoute.match(/^settings\//) && activeRoute !== "settings/index"){
      sidebar.push(createSidebar("settings/account_data", "gear"))
      sidebar.push(createSidebar("settings/payout_info", "money"))
      sidebar.push(createSidebar("settings/plan", "suitcase"))
    }else{
      sidebar.push(createSidebar("dashboard", "dashboard"))
      sidebar.push(createSidebar("courses", "book"))
      sidebar.push(createSidebar("users", "users"))
      sidebar.push(createSidebar("leads", "exchange"))
      sidebar.push(createSidebar("instructors", "mortar-board"))
      sidebar.push(createSidebar("testimonials", "thumbs-o-up"))
      sidebar.push(createSidebar("orders", "money"))
      sidebar.push(createSidebar("website/index", "desktop", "Website"))
      sidebar.push(createSidebar("coupons/index", "ticket", "Coupons"))
      sidebar.push(createSidebar("analytics/index", "bar-chart-o", "Analytics & Reporting"))
      sidebar.push(createSidebar("apps/index", "cubes", "App Store"))
      sidebar.push(createSidebar("settings/index", "gears", "Settings"))
    }

    return _.map(sidebar, function(option){

      var className = option.iconClass.match(/^pa-icon/) ? "pa-icon "+option.iconClass+"-small" : "fa fa-li " + option.iconClass,
          link = Link(_.extend({to: option.route}, params),
            <div><i className={className} title={option.label}></i> {option.label}</div>
          ),
          isActive = Sidebar.isActive(option.route, params, {});

      return <li key={option.label} className={isActive ? "active" : null}>{link}</li>
    }, this)
  },

  renderBack: function(){
    var back = null,
        activeRoute = this.state.activeRoute,
        params = this.state.params

    if(!activeRoute)
      return back

    if(activeRoute.match(/^lectures\//)){
      back = createBack("courses/curriculum")
    } else if(activeRoute.match(/^quizzes\//)){
      back = createBack("courses/curriculum")
    }else if(activeRoute.match(/^courses\//)){
      back = createBack("courses")
    }else if(activeRoute.match(/^(mc|text)Questions\//)){
      back = createBack("quizzes/questions")
    }else if(activeRoute.match(/^testimonials\//)){
      back = createBack("testimonials")
    }else if(activeRoute.match(/^instructors\//)){
      back = createBack("instructors")
    }else if(activeRoute.match(/^users\//)){
      back = createBack("users")
    }else if(activeRoute.match(/^leads\//)){
      back = createBack("leads")
    }else if(activeRoute.match(/^orders\//)){
      back = createBack("orders")
    }else if(activeRoute.match(/^website\//) && activeRoute !== "website/index"){
      back = createBack("website/index")
    }else if(activeRoute.match(/^apps\//) && activeRoute !== "apps/index"){
      back = createBack("apps/index")
    }else if(activeRoute.match(/^coupons\//) && activeRoute !== "coupons/index"){
      back = createBack("coupons/index")
    }else if(activeRoute.match(/^settings\//) && activeRoute !== "settings/index"){
      back = createBack("settings/index")
    }else if(activeRoute.match(/^analytics\//) && activeRoute !== "analytics/index"){
      back = createBack("analytics/index")
    }

    if(!back)
      return back

    return cloneWithProps(<Link className="fa-ul sub-navigation-back" to={back.route}>
      <i className="fa fa-li fa-arrow-left" title={"Back to " + back.label}></i> Back to {back.label}
    </Link>, params)
  },

  renderSidebarTiles: function(){
    var tiles = [],
        activeRoute = this.state.activeRoute,
        params = this.state.params,
        back = this.renderBack()

    if(back)
      tiles.push(back)

    if(!tiles.length)
      return null

    var {course,lecture,instructor,testimonial} = this.state;
    var app = AppCfg.getByRoute(this.state.activeRoute);

    var noImage = <div className="file-empty"><i className="fa fa-image"></i></div>

    if(activeRoute.match(/^(lectures|(mc|text)Questions)\//) && lecture){
      var regex = /\.(jpg|gif|jpeg|ico|png|tif|bmp)$/i;
      tiles.push(lecture.ui.imageUrl && lecture.ui.imageUrl.match(regex) ? <img src={lecture.ui.imageUrl} className="sub-navigation-thumb"/> : noImage)
    }else if(activeRoute.match(/^courses\//) && course){
      tiles.push(<img src={course.ui.imageUrl} className="sub-navigation-thumb"/>)
    }else if(activeRoute.match(/^instructors\//) && instructor){
      tiles.push(<img src={instructor.ui.imageUrl} className="sub-navigation-thumb"/>)
    }else if(activeRoute.match(/^testimonials\//) && testimonial){
      tiles.push(<img src={testimonial.ui.imageUrl} className="sub-navigation-thumb"/>)
    }else if(activeRoute.match(/^apps\//) && app) {
      tiles.push(<div className="sub-navigation-app-icon-container">
        <span className={"pa-icon "+app.icon}></span>
      </div>)
    }

    var items = _.map(tiles, function(e, idx){
      return <div key={idx}>{e}</div>
    })

    return <div className="sub-navigation">{items}</div>
  },

  render: function(){
    var e = document.getElementsByClassName("ebe-header-sidebar")[0],
        top = e && (e.offsetHeight + e.offsetTop) || 0;

    return <div>
      <div className="ebe-sidebar" style={{top}}>
        {this.renderSidebarTiles()}
        <ul className="fa-ul navigation-blocks">
          {this.renderSidebarItems()}
        </ul>

        <a href={"http://"+this.props.educator.domain} target="_blank" className="ebe-sticky-preview">
          <i className="fa fa-eye" title="Preview Site"></i> <span>Preview Site</span>
        </a>

      </div>

    </div>

  }
})

module.exports = Sidebar
