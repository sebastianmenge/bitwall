var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    RestRepo = require("../lib/rest_repo.js"),
    {formatMoney} = require("../../util.js")

var OrderStore = _.extend(new FluxStore("order"))

var OrderRepo = OrderStore.defineCollection({
  type: "ORDER",
  url: "/ebe-api2/orders"
})


OrderStore.initialize = function(id){
  this.dependsOn([EducatorStore])
  return OrderRepo.getEntries(id).tap(function(orders){
    OrderStore._orders = orders
  })
}

OrderStore.register(function(payload){
  var action = payload.action
})

module.exports = OrderStore