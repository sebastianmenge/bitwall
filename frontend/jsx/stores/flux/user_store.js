var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    RestRepo = require("../lib/rest_repo.js")

var UserStore = _.extend(new FluxStore("user"))

UserStore.initialize = function(id){
  this.dependsOn([EducatorStore])

  return UserRepo.getEntries(id).tap(function(users){
    UserStore._users = users
  })
}


var UserRepo = UserStore.defineCollection({
  type: "USER",
  decorate: function(e){
    return {fullname: e.firstname + " " + e.surname}
  }
})

UserStore.register(function(payload){
  var action = payload.action

})

module.exports = UserStore