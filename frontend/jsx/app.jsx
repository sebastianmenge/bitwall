var React = require("react"),
    Router = require("react-router"),
    _ = require("underscore"),
    Route = Router.Route,
    Link = Router.Link,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,
    Promise = require("bluebird"),
    WallStore = require("./stores/flux/wall_store.js");
    StoreState = require("./mixins/store_state.js");

var WallNav = require("./components/wall_nav.jsx");
    Show = require("./components/wall/_wall.jsx");


var App = React.createClass({
  mixins: [StoreState(WallStore), Router.State],
  getStoreState: function(){
    return {
      walls: WallStore.getWalls(),
    }
  },

  render: function(){
    var currentWallId = parseInt(this.getParams().wallId),
        currentWall = _.findWhere(this.state.walls, {id: currentWallId}),
        rows = currentWall.rows;

    return <div className='application-container'>
      <WallNav walls={this.state.walls} rows={rows}/>
      <RouteHandler wall={currentWall}/>
    </div>
  }
});

// ROUTES

var routes = (
  <Route handler={App} path="/">
    <Route name="wall" path="walls/:wallId" handler={Show} />
  </Route>
);

// INITIALIZATION

WallStore.init().then(function(){
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById("app"));
  });
})

window.React = React;
