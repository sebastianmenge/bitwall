var _ = require("underscore"),
    Promise = require("bluebird"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    req = require("../lib/req.js"),
    formatMoney = require("../../util.js").formatMoney

var PLANS = {
  free:           {id: "free",          sortIndex: 0, shortName: "Free",           longName: "Free plan (10% transaction fee / 0 Apps included)",  revShare: "10%",  price: formatMoney(0.0, "EUR"), priceLong: formatMoney(0.0, "EUR") + " / month"},
  basic_old:      {id: "basic_old",     sortIndex: 1, shortName: "Micro",          longName: "Micro plan (10% transaction fee / 2 Apps included)", revShare: "10%",  price: formatMoney(0.0, "EUR"), priceLong: formatMoney(0.0, "EUR") + " / month"},
  starter:        {id: "starter",       sortIndex: 2, shortName: "Starter",        longName: "Starter plan (10% transaction fee / 2 Apps included)",       revShare: "10%",   price: formatMoney(900, "EUR"), priceLong: formatMoney(900, "EUR") + " / month"},
  basic:          {id: "basic",         sortIndex: 3, shortName: "Basic",          longName: "Basic plan (8% transaction fee / 5 Apps included)",       revShare: "8%",   price: formatMoney(2900, "EUR"), priceLong: formatMoney(2900, "EUR") + " / month"},
  professional:   {id: "professional",  sortIndex: 4, shortName: "Professional",   longName: "Professional plan (5% transaction fee / 10 Apps included)", revShare: "5%",   price: formatMoney(9900, "EUR"), priceLong: formatMoney(9900, "EUR") + " / month"},
  premium:        {id: "premium",       sortIndex: 5, shortName: "Premium",        longName: "Premium plan (3% transaction fee/ 25 Apps included)",      revShare: "3%",   price: formatMoney(29900, "EUR"), priceLong: formatMoney(29900, "EUR") + " / month"}
}

function getPlans(currentPlanName, planUnitAmountInCents){

  var plans = _.clone(PLANS)

  _.each(this._plans, function(e){
    plans[e.planCode].price = formatMoney(e.unitAmountInCents, "EUR")
    plans[e.planCode].priceLong = plans[e.planCode].price + " / month"
  })

  _.each(PlanStore._plans, function(e){
    plans[e.planCode].url = e.url
  })


  if(planUnitAmountInCents){
    plans[currentPlanName].price = formatMoney(planUnitAmountInCents, "EUR")
    plans[currentPlanName].priceLong = plans[currentPlanName].price + " / month"
  }


  return plans
}

var PlanStore = _.extend(new FluxStore("plan"), {
  _plans: [],
  _subscriptions: [],
  _couponRedemptions: [],


  getPlanData: function(educator){
    var plans = getPlans(educator.plan, educator.planUnitAmountInCents),
        // currentPlan = plans[educator.plan == "basic_old" ? "basic" : educator.plan]
        currentPlan = plans[educator.plan]

    return {
      currentPlan: currentPlan,
      currentSubscription: _.find(this._subscriptions,s=>s.state=="active"||s.state=="canceled"),
      availablePlans: _.reject(_.without(plans, currentPlan), e => e.id == "basic_old" || e.id == "free"),
      couponRedemption: _.first(this._couponRedemptions),
      hasRecurlyAccount: this._subscriptions.length>0,
      inTrial: educator.inTrial,
      trialTill: educator.trialTill
    }
  }

})

PlanStore.initialize = function(){
  this.dependsOn([EducatorStore])

  var plans = req("get", "/pat-api/recurly/plans", {}, null),
      subscriptions = req("get","/ebe-api2/educator_subscriptions",{},"educatorSubscriptions"),
      couponRedemptions = req("get","/ebe-api2/educator_coupon_redemptions",{},"educatorCouponRedemptions");

  return Promise.join(plans, subscriptions, couponRedemptions, function(plans, subscriptions, couponRedemptions) {
    PlanStore._plans = plans;
    PlanStore._subscriptions = subscriptions;
    PlanStore._couponRedemptions = couponRedemptions;
  });
}

PlanStore.register(function(payload){
  var action = payload.action

  switch(action.type){
    case "CHANGE_PLAN":
      var {oldPlanId, newPlanId, hasRecurlyAccount} = action

      if (!hasRecurlyAccount){
        var educator = EducatorStore.getEducatorAny()
        window.location.href = _.where(PlanStore._plans, {planCode: newPlanId})[0].url + "/" + educator.id + "?email=" + encodeURIComponent(educator.contractContactEmail||"")
        return
      } else {
        req("put", "/pat-api/recurly/change", {newPlanCode: newPlanId, oldPlanCode: oldPlanId}, null).then(function(res){
          var url = window.location.href,
              isUpgrade = PLANS[newPlanId].sortIndex > PLANS[oldPlanId].sortIndex

          url += ((url.indexOf("?") == -1 ? "?" : "&") + ("j" + (isUpgrade ? "u" : "d")  + "p=" + newPlanId))

          window.location.href = url
        })
      }
      break
  }
})


module.exports = PlanStore
