var Promise = require("bluebird"),
    Route = require("react-router").Route,
    AccountData = require("./account_data.jsx"),
    PayoutInfo = require("./payout_info.jsx"),
    Plan = require("./plan.jsx"),
    One = require("./_settings.jsx"),
    Index = require("./_index.jsx"),
    createApp = require("../../util.js").createApp

var App = createApp(function() {
  return Promise.resolve()
})

module.exports = function({prefix}) {

  return <Route handler={App}>

    <Route name="settings/index"
           routeName="settings/index"
           handler={Index}
           path={prefix + "/settings/index"}/>

    <Route name="settings"
           routeName="settings"
           handler={One}
           path={prefix + "/settings"}>

      <Route name="settings/account_data"
             routeName="settings/account_data"
             handler={AccountData}
             path={prefix + "/settings/account_data"}/>
      <Route name="settings/payout_info"
             routeName="settings/payout_info"
             handler={PayoutInfo}
             path={prefix + "/settings/payout_info"}/>
      <Route name="settings/plan"
             routeName="settings/plan"
             handler={Plan}
             path={prefix + "/settings/plan"}/>
    </Route>
  </Route>
}