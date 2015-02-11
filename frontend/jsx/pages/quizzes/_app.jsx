var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    One = require("./_quizzes.jsx"),
    Show = require("./show.jsx"),
    Question = require("./question.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp,
    TextQuestionApp = require("../text_questions/_app.jsx"),
    McQuestionApp = require("../mc_questions/_app.jsx");

var App = createApp(() => Promise.resolve())

module.exports = function({prefix}){
  return <Route handler={App} path={prefix}>
    <Route handler={One} path={prefix + "/quizzes/:quizId"}>

      <Route  name="quizzes/show"
              routeName="quizzes/show"
              path={prefix + "/quizzes/:quizId/show"}
              handler={Show}/>

      <Route  name="quizzes/questions"
              routeName="quizzes/questions"
              path={prefix + "/quizzes/:quizId/questions"}
              handler={Question}/>

      {TextQuestionApp({prefix: prefix + "/quizzes/:quizId"})}
      {McQuestionApp({prefix: prefix + "/quizzes/:quizId"})}

    </Route>
  </Route>
}