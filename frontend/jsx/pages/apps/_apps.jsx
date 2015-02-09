var React = require("react"),
    Promise = require("bluebird"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

var Apps = React.createClass({
  mixins: [StoreState(Store.Educator)],

  getStoreState: function(){
    return {educator: Store.Educator.getEducatorAny()}
  },

  render: function(){
    var {educator} = this.state
    return <this.props.activeRouteHandler
      educator={educator}
    />
  }
})

module.exports = Apps