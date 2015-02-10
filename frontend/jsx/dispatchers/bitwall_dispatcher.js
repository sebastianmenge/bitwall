var _ = require("underscore"),
    Dispatcher = require("./flux_dispatcher.js")

var BitwallDispatcher = _.extend(new Dispatcher(), {

  handleServerAction: function(action) {
    var payload = {
      source: 'SERVER_ACTION',
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction: function(action) {
    var payload = {
      source: 'VIEW_ACTION',
      action: action
    };
    this.dispatch(payload);
  }

})

module.exports = BitwallDispatcher
