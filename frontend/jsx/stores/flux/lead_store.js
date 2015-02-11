var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    RestRepo = require("../lib/rest_repo.js")

var LeadStore = _.extend(new FluxStore("lead"))

LeadStore.initialize = function(ids){
  this.dependsOn([EducatorStore])

  return LeadRepo.getEntries(ids).tap(function(leads){
    LeadStore._leads = leads
  })
}


var LeadRepo = LeadStore.defineCollection({
  type: "LEAD",
  url: "/ebe-api2/interested_emails"
})

LeadStore.register(function(payload){
  var action = payload.action

})

module.exports = LeadStore