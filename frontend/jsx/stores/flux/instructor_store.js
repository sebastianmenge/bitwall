var _ = require("underscore"),
    Router = require("react-router"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    findImageUrl = require("../../util.js").findImageUrl,
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js")

var InstructorStore = _.extend(new FluxStore("instructor"))

InstructorStore.initialize = function(ids){
  this.dependsOn([EducatorStore])

  var instructors = InstructorRepo.getEntries(ids),
      files = instructors.map(e => e.links.mediaFile).filter(e => !!e).then(FileRepo.getEntries)

  return Promise.join(instructors, files, function(instructors, files){
    InstructorStore._instructors = instructors
    InstructorStore._files = files
  })
}

var FileRepo = InstructorStore.defineCollection({type: "FILE", url: "/ebe-api2/files"})

var InstructorRepo = InstructorStore.defineCollection({
  type: "INSTRUCTOR",
  url: "/ebe-api2/instructors",
  decorate: function(e){
    return {imageUrl: findImageUrl(InstructorStore.getFile(e.links.mediaFile)) || "https://patience-live.s3.amazonaws.com/15508362324767-key-01da0936c800e141824e9d45f1aae9860b884b60.zFbZwaIc3l5OFxNmroGU_height640.png"}
  }
})

InstructorStore.register(function(payload){
  var action = payload.action

  switch(action.type){
    case "INSTRUCTOR_LINKS_CHANGED":
      if(action.model.links.mediaFile && action.model.links.mediaFile !== action.prev.mediaFile){
        FileRepo.getEntry(action.model.links.mediaFile).bind(this).then(function(file){
          this._files.push(file)
        }).then(this.emitChange)
      }
      return


    case "INSTRUCTOR_CREATED":
      return Router.transitionTo("instructors/show", {instructorId: action.id})
  }

})

module.exports = InstructorStore