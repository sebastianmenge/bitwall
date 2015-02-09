var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    RestRepo = require("../lib/rest_repo.js"),
    _str = require("underscore.string"),
    {findImageUrl} = require("../../util.js"),
    AppCfg = require("../../app_config.js"),
    req = require("../lib/req.js");


var EducatorStore = _.extend(new FluxStore("educator"), {
  _refreshingDomainIds: [],
  isDomainRefreshing: function(domain){
    return _.include(this._refreshingDomainIds, domain.id)
  },

  hasActiveApp: function(appName){
    var educator = this.getEducatorAny()
    return educator["app" + _str.capitalize(appName) + "Active"] === true
  },

  getSignupCategories: function(){
    return EducatorStore._signupCategories
  },

  activeAppCount: function(){
    var educator = this.getEducatorAny(),
        appNames = _.pluck(AppCfg.entries, "name")

    var numActive = 0;

    for(var i=0; i < appNames.length; i++){
      if(this.hasActiveApp(appNames[i]))
        numActive++
    }

    return numActive
  },

  isAppQuotaExceeded: function(){
    var educator = this.getEducatorAny()
    return this.activeAppCount() >= educator.appQuota
  },

  // hasPlanRight: function(plan){
  //   var educator = this.getEducatorAny()

  //   if(plan == "free"){
  //     return true
  //   }else if(plan == "basic"){
  //     return _.include(["basic", "basic_old", "professional", "premium"], educator.plan)
  //   }else if(plan == "professional"){
  //     return _.include(["professional", "premium"], educator.plan)
  //   }else if(plan == "premium"){
  //     return educator.plan == "premium"
  //   }else{
  //     throw "unsupported plan:"+plan
  //   }
  // }
})


var EducatorRepo = EducatorStore.defineCollection({
  type: "EDUCATOR",
  url: "/ebe-api2/educators",
  links: {
    paymillTransactions:  {type: "PAYMILL_TRANSACTION",   cardinality: "many", isOwner: true},
    featuredInstructors:  {type: "INSTRUCTOR",            cardinality: "many"},
    featuredTestimonials: {type: "TESTIMONIAL",           cardinality: "many"},
    featuredCourses:      {type: "COURSE",                cardinality: "many"},
    instructors:          {type: "INSTRUCTOR",            cardinality: "many", isOwner: true},
    testimonials:         {type: "TESTIMONIAL",           cardinality: "many", isOwner: true},
    courses:              {type: "COURSE",                cardinality: "many", isOwner: true},
    users:                {type: "USER",                  cardinality: "many", isOwner: true},
    domains:              {type: "DOMAIN",                cardinality: "many", isOwner: true},
    pageBgImage:          {type: "FILE",                  cardinality: "one"},
    pagePromoVideo:       {type: "FILE",                  cardinality: "one"},
    favicon:              {type: "FILE",                  cardinality: "one"},
    logo:                 {type: "FILE",                  cardinality: "one"}
  },
  decorate: function(e){
    return {
      backgroundUrl: findImageUrl(EducatorStore.getFile(e.links.pageBgImage)) || "https://patience-live.s3.amazonaws.com/f5/3911a02d0211e49cb46d7c8598d8f6/teaser_image-key-446875d54ec1c22b7d5deef8b5056d9e2728f671.jpg",
      teaserImageUrl: findImageUrl(EducatorStore.getFile(e.links.pageTeaserImage)) || "https://patience-live.s3.amazonaws.com/f5/3911a02d0211e49cb46d7c8598d8f6/teaser_image-key-446875d54ec1c22b7d5deef8b5056d9e2728f671.jpg",
      billboardBgUrl: findImageUrl(EducatorStore.getFile(e.links.appLaunchBillboardBgImageId))
    }
  }
})

var DomainRepo = EducatorStore.defineCollection({
  type: "DOMAIN",
  url: "/ebe-api2/domains"
})

// var B2bSignupCategoryRepo = EducatorStore.defineCollection({
//   type: "B2B_SIGNUP_CATEGORY"
// })

var MeRepo = EducatorStore.defineCollection({
  type: "ME",
  // url: "/ebe-api2/domains"
})

var FileRepo = EducatorStore.defineCollection({type: "FILE", url: "/ebe-api2/files"})

EducatorStore.initialize = function(id){
  var educator = EducatorRepo.getEntry(id),
      domains = educator.then(e => DomainRepo.getEntries(e.links.domains)),
      me = req("get","/ebe-api/mes",null,"users"),
      signupCategories = req("get", "/pfe/b2b-signup/categories", null, "categories");

  var pageBgImageFile = educator.then(e => e.links.pageBgImage),
      pagePromoVideoFile = educator.then(e => e.links.pagePromoVideo),
      faviconFile = educator.then(e => e.links.favicon),
      logoFile = educator.then(e => e.links.logo),
      teaserImage = educator.then(e => e.links.pageTeaserImage),
      appLaunchBillboardBgImage = educator.then(e => e.appLaunchBillboardBgImageId);

  var files = Promise.join(pageBgImageFile, pagePromoVideoFile, logoFile, faviconFile, teaserImage, appLaunchBillboardBgImage, function(pageBgImageFile, pagePromoVideoFile, logoFile, faviconFile, teaserImage, appLaunchBillboardBgImage){
    return _.reject([pageBgImageFile, pagePromoVideoFile, logoFile, faviconFile, teaserImage, appLaunchBillboardBgImage], e => !e)
  }).then(FileRepo.getEntries)

  return Promise.join(educator, me, domains, files, signupCategories, function(educator, me, domains, files, signupCategories){
    EducatorStore._educators = [educator]
    EducatorStore._mes = me
    EducatorStore._domains = domains
    EducatorStore._files = files
    EducatorStore._signupCategories = signupCategories
  })
}

EducatorStore.register(function(payload){
  var action = payload.action

  switch(action.type){

    case "EDUCATOR_UPDATED":
    case "EDUCATOR_LINKS_CHANGED":
      var files = _.values(_.pick(action.model.links, "pageBgImage","pagePromoVideo","favicon","logo"));
      files = _.compact(_.union(files,[action.model.appLaunchBillboardBgImageId]));

      return FileRepo.getEntries(files).bind(this).then(function(files){
        _.each(files, e => this._files.push(e))
      }).then(this.emitChange)

    case "DOMAIN_DNS_REFRESH":
      this._refreshingDomainIds.push(action.id)
      this.emitChange()

      return DomainRepo.reload(action.id).bind(this).then(function(){
        this._refreshingDomainIds = _.without(this._refreshingDomainIds, action.id)
        this.emitChange()
      })

    case "DOMAIN_UPDATED":
      return DomainRepo.reloadAll().then(this.emitChange)

    default:
  }
})

module.exports = EducatorStore
