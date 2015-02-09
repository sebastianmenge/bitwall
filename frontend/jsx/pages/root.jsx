var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,
    Promise = require("bluebird");


var Root = React.createClass({
  // mixins: [StoreState(Store.Educator)],

  // getStoreState: function(){
  //   return {
  //     educator: Store.Educator.getEducatorAny(),
  //     me: Store.Educator.getMeAny()
  //   }
  // },

  render: function(){
    return <div>
      Hello
    </div>
  }


})

module.exports = Root
