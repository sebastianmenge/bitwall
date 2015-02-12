var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/bitwall_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    _str = require("underscore.string"),
    req = require("../lib/req.js")

var WallStore = _.extend(new FluxStore("wall"),{
  getWalls: function() {
    return this._walls;
  }
});

WallStore.initialize = function() {
  var walls = req('GET', 'walls', {}, 'walls');

  return Promise.join(walls, function(walls) {
    WallStore._walls = walls
  })
},

module.exports = WallStore
