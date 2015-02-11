var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    RestRepo = require("../lib/rest_repo.js")

var StatisticStore = _.extend(new FluxStore("statistic"))

var StatisticRepo = StatisticStore.defineCollection({
  type: "STATISTIC",
  url: "/ebe-api2/course_statistics"
})

StatisticStore.initialize = function(ids){
  this.dependsOn([EducatorStore])

  var statistics = StatisticRepo.getEntries(ids)
  return Promise.join(statistics, function(statistics){
    StatisticStore._statistics = statistics
  })
}

StatisticStore.register(function(payload){
  var action = payload.action
})

module.exports = StatisticStore