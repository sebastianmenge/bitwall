var React = require("react"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    One = require("./_testimonials.jsx"),
    Show = require("./show.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Store.Testimonial.init(educator.links.testimonials)
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="testimonials"
            routeName="testimonials"
            handler={Index}
            path={prefix + "/testimonials"}/>

    <Route  handler={One} path={prefix + "/testimonials/:testimonialId"}>

      <Route  name="testimonials/show"
              routeName="testimonials/show"
              path={prefix + "/testimonials/:testimonialId/show"}
              handler={Show}/>

    </Route>
  </Route>
}