var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Promise.join(
    Store.Course.init(educator.links.courses),
    Store.Instructor.init(educator.links.instructors)
  )
})

module.exports = function({prefix}){
  return <Route handler={App} path={prefix}>
    <Route  name="dashboard"
            routeName="dashboard"
            path={prefix + "/dashboard"}
            handler={Index}/>
  </Route>
}
