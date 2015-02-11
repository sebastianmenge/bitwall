var React = require("react"),
    Promise = require("bluebird"),
    Route = require("react-router").Route,
    AppPage = require("./app_page.jsx"),
    _str = require("underscore.string"),
    One = require("./_apps.jsx"),
    Index = require("./_index.jsx"),
    Store = require("../../stores/flux/store.js"),
    createApp = require("../../util.js").createApp,
    AppCfg = require("../../app_config.js")

var App = createApp(function(){
  var educator = Store.Educator.getEducatorAny()
  return Promise.join(Store.Instructor.init(educator.links.instructors), Store.Course.init(educator.links.courses))
})




module.exports = function({prefix}){


  var appRoutes = AppCfg.entries.map(function(app){
    return <Route   key={app.name}
                    name={app.route}
                    routeName={app.route}
                    handler={AppPage}
                    path={prefix + "/apps/" + _str.underscored(app.name)}/>
  })


  return <Route handler={App}>

    <Route  name="apps/index"
            routeName="apps/index"
            handler={Index}
            path={prefix + "/apps/index"}/>

    <Route  name="apps"
            routeName="apps"
            handler={One}
            path={prefix + "/apps"}>

        {appRoutes}

    </Route>


  </Route>
}
