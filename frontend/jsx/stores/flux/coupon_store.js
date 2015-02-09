var _ = require("underscore"),
    Router = require("react-router"),
    Promise = require("bluebird"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FluxStore = require("../lib/flux_store.js"),
    CourseStore = require("./course_store.js")


var CouponStore = _.extend(new FluxStore("coupon"))

CouponStore.initialize = function(ids) {
  this.dependsOn([CourseStore])

  var coupons = CouponRepo.getEntries(ids)
  return coupons.then(function(coupons) {
    CouponStore._coupons = coupons
  })
}

var CouponRepo = CouponStore.defineCollection({
  type: "COUPON",
  url: "/ebe-api2/coupons"
})

CouponStore.register(function(payload) {
  var action = payload.action

  // switch(action.type) {
  //   case ""
  // }
})

module.exports = CouponStore