var React = require("react"),
    StoreState = require("../../mixins/store_state"),
    Store = require("../../stores/flux/store")

module.exports = React.createClass({
  mixins: [StoreState(Store.Educator)],

  getStoreState: function() {
    return {
      educator: Store.Educator.getEducatorAny()
    }
  },

  render: function() {
    return <this.props.activeRouteHandler educator={this.props.educator}/>
  }
})