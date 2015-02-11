var EventEmitter = require('events').EventEmitter,
    _ = require("underscore"),
    Promise = require("bluebird"),
    req = require("./req.js");

var FluxStore = function(name){

  if(!name)
    throw "missing name argument"

  this._name = name

  this.emitChange = () => {
    this.emit("change")
    return Promise.resolve()
  }

  this.addChangeListener = function(callback) {
    this.on("change", callback)
  }

  this.removeChangeListener = function(callback) {
    this.removeListener("change", callback)
  }

  this.init = function(){
    if(this._initialized || this._initializing)
      return Promise.resolve()

    this._initializing = true

    return this.initialize.apply(this, arguments).bind(this).tap(function(){
      this._initialized = true
      this._initializing = false
    })
  }
}

_.extend(FluxStore.prototype, EventEmitter.prototype)

module.exports = FluxStore
