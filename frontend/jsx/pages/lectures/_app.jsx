var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    One = require("./_lectures.jsx"),
    Show = require("./show.jsx"),
    Attachments = require("./attachments.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp;

var App = createApp(() => Promise.resolve())

module.exports = function({prefix}){
  return <Route handler={App} path={prefix}>
    <Route handler={One} path={prefix + "/lectures/:lectureId"}>

      <Route  name="lectures/show"
              routeName="lectures/show"
              path={prefix + "/lectures/:lectureId/show"}
              handler={Show}/>

      <Route  name="lectures/attachments"
              routeName="lectures/attachments"
              path={prefix + "/lectures/:lectureId/attachments"}
              handler={Attachments}/>
    </Route>
  </Route>
}