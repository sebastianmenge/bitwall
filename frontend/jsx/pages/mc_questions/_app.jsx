var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    One = require("./_mc_questions.jsx"),
    Show = require("./show.jsx"),
    New = require("./new.jsx"),
    createApp = require("../../util.js").createApp

var App = createApp(() => Promise.resolve())

module.exports = function({prefix}){
  return <Route handler={App} path={prefix}>
    <Route  name="mcQuestions/new"
            routeName="mcQuestions/new"
            path={prefix + "/mc-questions/new"}
            handler={New}/>
    <Route handler={One} path={prefix + "/mc-questions/:questionId"}>

      <Route  name="mcQuestions/show"
              routeName="mcQuestions/show"
              path={prefix + "/mc-questions/:questionId/show"}
              handler={Show}/>

    </Route>
  </Route>
}