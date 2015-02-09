var React = require("react"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    One = require("./_instructors.jsx"),
    Show = require("./show.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Store.Instructor.init(educator.links.instructors)
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="instructors"
            routeName="instructors"
            handler={Index}
            path={prefix + "/instructors"}/>

    <Route  handler={One} path={prefix + "/instructors/:instructorId"}>
      <Route  name="instructors/show"
              routeName="instructors/show"
              path={prefix + "/instructors/:instructorId/show"}
              handler={Show}/>
    </Route>
  </Route>

}