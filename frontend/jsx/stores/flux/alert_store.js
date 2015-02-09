var _ = require("underscore"),
    // ActiveStore = require("react-router/modules/stores/ActiveStore.js"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js")

var AlertStore = _.extend(new FluxStore("alert"), {
  _severity: null,
  _message: null,
  _expire: null,

  getSeverity: function(){
    return this._severity
  },
  getMessage: function(){
    return this._message
  }
})

AlertStore.initialize = function(id){
  return Promise.resolve()
}


// TODO: find way to make it work!
// ActiveStore.addChangeListener(clear)

var expireId = null

function startExpire(){
  expireId = setInterval(function(){
    var now = (new Date()).getTime()

    if(AlertStore._expire && now > AlertStore._expire)
      clear()

  }, 1000)
}

function stopExpire(){
  if(expireId){
    clearInterval(expireId)
    expireId = null
  }
}

function set(severity, message, expire){
  if(expireId)
    clear()

  AlertStore._severity = severity
  AlertStore._message = message
  AlertStore._expire = (new Date()).getTime() + (expire||10000)
  AlertStore.emitChange()

  startExpire()
}

function clear(){
  AlertStore._severity = null
  AlertStore._message = null
  AlertStore._expire = null
  stopExpire()

  AlertStore.emitChange()
}

AlertStore.register(function(payload){
  var action = payload.action

  switch(action.type){
    case "ALERT_ERROR":
      return set("ERROR", action.message, 10000)

    case "ALERT_SUCCESS":
      return set("SUCCESS", action.message, 3000)

    case "ALERT_WARN":
      return set("WARN", action.message, 10000)

    case "ALERT_CLEAR":
      return clear()
  }
})

module.exports = AlertStore
