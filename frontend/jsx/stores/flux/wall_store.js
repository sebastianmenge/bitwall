var _ = require("underscore"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/bitwall_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    RestRepo = require("../lib/rest_repo.js"),
    _str = require("underscore.string"),
    {findImageUrl} = require("../../util.js"),
    req = require("../lib/req.js");


var WallStore = _.extend(new FluxStore("wall"));

WallStore.initialize = function(id){
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

WallStore.register(function(payload){
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
