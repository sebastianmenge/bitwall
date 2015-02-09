var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    New = require("./new.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(function(){
  var educator = Store.Educator.getEducatorAny()
  return Store.Course.init(educator.links.courses).then(function() {
    return Store.Coupon.init(educator.links.coupons)

  })
})

module.exports = function({prefix}){

  return <Route handler={App}>

    <Route  handler={Index}
            routeName="coupons/index"
            name="coupons/index"
            path={prefix + "/coupons/index"}/>
    <Route  handler={New}
            routeName="coupons/new"
            name="coupons/new"
            path={prefix + "/coupons/new"}/>
  </Route>
}