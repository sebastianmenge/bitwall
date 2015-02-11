var React = require("react"),
    Route = require("react-router").Route,
    Index = require("./_index.jsx"),
    One = require("./_users.jsx"),
    Show = require("./show.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp

var App = createApp(() => {
  var educator = Store.Educator.getEducatorAny()
  return Store.User.init(educator.links.users)
})

module.exports = function({prefix}){
  return <Route handler={App}>
    <Route  name="users"
            routeName="users"
            handler={Index}
            path={prefix + "/users"}/>

    <Route  handler={One} path={prefix + "/users/:userId"}>
      <Route  name="users/show"
              routeName="users/show"
              path={prefix + "/users/:userId/show"}
              handler={Show}/>
    </Route>


  </Route>
}