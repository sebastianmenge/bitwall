var React = require("react"),
    Route = require("react-router").Route,
    Promise = require("bluebird"),
    Index = require("./_index.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(function(){
  var educator = Store.Educator.getEducatorAny()
  return Store.Order.init(educator.links.orders)
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="orders"
            routeName="orders"
            handler={Index}
            path={prefix + "/orders"}/>
  </Route>
}