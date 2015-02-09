var _ = require("underscore"),
    _s = require("underscore.string"),
    _i = require('underscore.inflections'),
    Promise = require("bluebird"),
    Router = require("react-router"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    {findImageUrl} = require('../../util.js')

var TestimonialStore = _.extend(new FluxStore("testimonial"))

TestimonialStore.initialize = function(ids){
  this.dependsOn([EducatorStore])

  var testimonials = TestimonialRepo.getEntries(ids),
      files = testimonials.map(e => e.links.mediaFile).filter(e => !!e).then(FileRepo.getEntries)

  return Promise.join(testimonials, files, function(testimonials, files){
    TestimonialStore._testimonials = testimonials
    TestimonialStore._files = files
  })
}

var FileRepo = TestimonialStore.defineCollection({type: "FILE", url: "/ebe-api2/files"})

var TestimonialRepo = TestimonialStore.defineCollection({
  type: "TESTIMONIAL",
  url: "/ebe-api2/testimonials",
  links: {
    mediaFile: {type: "FILE", cardinality: "one"}
  },
  decorate: function(e){
    return {imageUrl: findImageUrl(TestimonialStore.getFile(e.links.mediaFile)) || "https://patience-live.s3.amazonaws.com/15508362324765-key-69038dc4fc9a251b638e9b96ab0283ec0baa7d61.kbi40ncY0FueCWEQR3oW_height640.png"}
  }
})

TestimonialStore.register(function(payload){

  var action = payload.action

  switch(action.type){
    case "TESTIMONIAL_LINKS_CHANGED":
      if(action.model.links.mediaFile && action.model.links.mediaFile !== action.prev.mediaFile){
        FileRepo.getEntry(action.model.links.mediaFile).bind(this).then(function(file){
          this._files.push(file)
        }).then(this.emitChange)
      }
      return

    case "TESTIMONIAL_CREATED":
      return Router.transitionTo("testimonials/show", {testimonialId: action.id})
  }

})

module.exports = TestimonialStore