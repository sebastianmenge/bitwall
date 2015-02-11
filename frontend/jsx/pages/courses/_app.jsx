var React = require("react"),
    Route = require("react-router").Route,
    Promise = require("bluebird"),
    Index = require("./_index.jsx"),
    One = require("./_courses.jsx"),
    Show = require("./show.jsx"),
    Dashboard = require("./dashboard.jsx"),
    Info = require("./info.jsx"),
    Curriculum = require("./curriculum.jsx"),
    Pricing = require("./pricing.jsx"),
    Store = require("../../stores/flux/store.js"),
    LectureApp = require("../lectures/_app.jsx"),
    QuizApp = require("../quizzes/_app.jsx"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Promise.join(
    Store.Course.init(educator.links.courses),
    Store.Statistic.init(educator.links.courses),
    Store.Instructor.init(educator.links.instructors),
    Store.Testimonial.init(educator.links.testimonials)
  )
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="courses"
            routeName="courses"
            handler={Index}
            path={prefix + "/courses"}/>

    <Route handler={One} path={prefix + "/courses/:courseId"}>

      <Route  name="courses/show"
              routeName="courses/show"
              path={prefix + "/courses/:courseId/show"}
              handler={Show}/>

      <Route  name="courses/dashboard"
              routeName="courses/dashboard"
              path={prefix + "/courses/:courseId/dashboard"}
              handler={Dashboard}/>

      <Route  name="courses/info"
              routeName="courses/info"
              path={prefix + "/courses/:courseId/info"}
              handler={Info}/>

      <Route  name="courses/curriculum"
              routeName="courses/curriculum"
              path={prefix + "/courses/:courseId/curriculum"}
              handler={Curriculum}/>

      <Route  name="courses/pricing"
              routeName="courses/pricing"
              path={prefix + "/courses/:courseId/pricing"}
              handler={Pricing}/>

      {LectureApp({prefix: prefix + "/courses/:courseId"})}
      {QuizApp({prefix: prefix + "/courses/:courseId"})}

    </Route>
  </Route>
}