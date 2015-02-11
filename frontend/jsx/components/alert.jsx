var React = require("react"),
    cx = require("react/addons").addons.classSet,
    Dispatcher = require("../dispatchers/patience_dispatcher.js"),
    Store = require("../stores/flux/store.js"),
    StoreState = require("../mixins/store_state.js")

// type:
// error, warn, success

module.exports = React.createClass({
  mixins: [StoreState(Store.Alert)],

  onClick: function(e){
    e.preventDefault()
    Dispatcher.handleViewAction({type: "ALERT_CLEAR"})
  },

  getStoreState: function(){
    return {severity: Store.Alert.getSeverity(), message: Store.Alert.getMessage()}
  },

  render: function(){
    var {severity,message} = this.state

    if(!severity)
      return null

    var alertClassName = "alert alert-"+(severity == "ERROR" ? "danger" : severity).toLowerCase()

    return <div className="ebe-alerts">
      <div className={alertClassName}>
        {message}
        <a onClick={this.onClick} className="close">
          <i className="fa fa-times-circle"></i>
        </a>
      </div>
    </div>
  }
})
