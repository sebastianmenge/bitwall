var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route

var Wall = React.createClass({
  mixins: [Router.State],
  displayName: "Wall",

  componentDidMount: function() {

  },

  componentWillUnmount: function() {

  },

  render: function() {
    return <div>
      Wall {this.getParams().wallId}
    </div>
  }

})

module.exports = Wall
