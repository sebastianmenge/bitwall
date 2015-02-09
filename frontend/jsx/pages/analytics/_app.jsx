var Promise = require("bluebird"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    Reporting = require("./_reporting.jsx"),
    createApp = require("../../util").createApp

var App = createApp(function () {
  return Promise.resolve()
})

module.exports = function({prefix}) {

  return <Route handler={App}>

    <Route name="analytics/index"
           routeName="analytics/index"
           handler={Index}
           path={prefix + "/analytics/index"}/>
    <Route handler={Reporting}
           routeName="analytics/reporting"
           name="analytics/reporting"
           path={prefix + "/analytics/reporting"}/>
  </Route>
}