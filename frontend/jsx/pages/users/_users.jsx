var React = require("react"),
    Store = require("../../stores/flux/store"),
    StoreState = require("../../mixins/store_state.js")

var Users = React.createClass({
  mixins: [StoreState(Store.User)],
  getStoreState: function(){
    return {user: Store.User.getUser(parseInt(this.props.params.userId, 10))}
  },
  render: function(){
    var {user} = this.state
    return <this.props.activeRouteHandler
      user={user}
    />
  }
})

module.exports = Users