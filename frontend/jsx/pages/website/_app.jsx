var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    Show = require("./show.jsx"),
    Branding = require("./branding.jsx"),
    One = require("./_website.jsx"),
    Index = require("./_index.jsx"),
    Domain = require("./domain.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(function(){
  var educator = Store.Educator.getEducatorAny()
  return Promise.join(
    Store.Course.init(educator.links.courses),
    Store.Instructor.init(educator.links.instructors),
    Store.Testimonial.init(educator.links.testimonials)
  )
})

module.exports = function({prefix}){
  return <Route handler={App}>

    <Route  name="website/index"
            routeName="website/index"
            handler={Index}
            path={prefix + "/website/index"}/>

    <Route  name="website"
            routeName="website"
            handler={One}
            path={prefix + "/website"}>

        <Route  name="website/show"
                routeName="website/show"
                handler={Show}
                path={prefix + "/website/show"}/>

        <Route  name="website/branding"
                routeName="website/branding"
                handler={Branding}
                path={prefix + "/website/branding"}/>

        <Route  name="website/domain"
                routeName="website/domain"
                handler={Domain}
                path={prefix + "/website/domain"}/>
    </Route>


  </Route>
}