var React = require("react"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Store.Lead.init(educator.links.leads)
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="leads"
            routeName="leads"
            handler={Index}
            path={prefix + "/leads"}/>

  </Route>
}