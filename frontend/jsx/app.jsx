// play nicely with other components/dependencies requiring jquery

var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    Link = Router.Link,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,
    Promise = require("bluebird");

var Show = require("./sections/walls/_show.jsx");


var App = React.createClass({
  // mixins: [StoreState(Store.Educator)],
  // getStoreState: function(){
  //   return {
  //     educator: Store.Educator.getEducatorAny(),
  //     me: Store.Educator.getMeAny()
  //   }
  // },
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

window.onload = function() {
  // Router.run(routes, function (Handler) {
  //   React.render(<Index/>, document.getElementById("app"));
  // });
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById("app"));
  });
};


// Store.Educator.init(EDUCATOR_ID).then(e => Store.Plan.init()).then(Store.Alert.init()).then(Store.Processing.init()).then(function(){
//   React.renderComponent(routes, document.getElementById("app"))
// })

window.React = React;
