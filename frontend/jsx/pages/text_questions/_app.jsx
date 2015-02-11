var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    One = require("./_text_questions.jsx"),
    Show = require("./show.jsx"),
    New = require("./new.jsx"),
    createApp = require("../../util.js").createApp

var App = createApp(() => Promise.resolve())

module.exports = function({prefix}){
  return <Route handler={App} path={prefix}>
    <Route  name="textQuestions/new"
            routeName="textQuestions/new"
            path={prefix + "/text-questions/new"}
            handler={New}/>
    <Route handler={One} path={prefix + "/text-questions/:questionId"}>

      <Route  name="textQuestions/show"
              routeName="textQuestions/show"
              path={prefix + "/text-questions/:questionId/show"}
              handler={Show}/>

    </Route>
  </Route>
}