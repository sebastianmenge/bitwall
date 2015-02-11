var _ = require("underscore"),
    // ActiveStore = require("react-router/modules/stores/ActiveStore.js"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js")

var ProcessingStore = _.extend(new FluxStore("processing"), {
  _processing: null,

  getCurrentState: function() {
    return this._processing;
  },
})

ProcessingStore.initialize = function(id){
  return Promise.resolve()
}

function set(state) {
  if (typeof state === 'undefined')
    throw new Error("_setProcessingState(): Please provide a state.");

  ProcessingStore._processing = state;
  ProcessingStore.emitChange()
}

ProcessingStore.register(function(payload){
  var action = payload.action

  switch(action.type){
    case "PROCESSING_START":
      set(true)
      return

    case "PROCESSING_END":
      set(false)
      return

    case "PROCESSING_ERROR":
      set(false)
      return
  }
})

module.exports = ProcessingStore
