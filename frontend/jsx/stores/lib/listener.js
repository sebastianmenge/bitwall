var Promise = require("bluebird"),
    _ = require("underscore")

var Listener = {
  emitChange: function(){
    return Promise.resolve(this._listeners).bind(this).map(function(listener){
      return listener(this)
    })
  },
  listen: function(listener){
    this._listeners.push(listener)
    return listener(this)
  },
  unlisten: function(listener){
    this._listeners = _.without(this._listeners, listener)
  }
}

module.exports = Listener