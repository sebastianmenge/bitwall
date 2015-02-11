// play nicely with other components/dependencies requiring jquery

var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    Link = Router.Link,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,

    Promise = require("bluebird"),
    WallStore = require("./stores/flux/wall_store.js");
    StoreState = require("./mixins/store_state.js");

var Show = require("./sections/walls/_show.jsx");


var App = React.createClass({
  mixins: [StoreState(WallStore)],
  getStoreState: function(){
    return {
      walls: WallStore.getWalls(),
    }
  },
  componentDidMount: function() {
    console.log("triggered");
  },

  render: function(){
    return <div>
      <Link to="wall" params={{wallId: "123"}}>Wall</Link>
      <RouteHandler/>
    </div>
  }
});

var routes = (
  <Route handler={App} path="/">
    <Route name="wall" path="walls/:wallId" handler={Show} />
  </Route>
);

WallStore.init().then(function(){
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById("app"));
  });
})

window.React = React;
