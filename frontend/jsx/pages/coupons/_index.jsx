var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state"),
    Bootstrap = require("react-bootstrap"),
    Store = require("../../stores/flux/store"),
    Link = require("react-router").Link,
    BuildableList = require("../../mixins/buildable_list.jsx"),
    Type = require("../../components/table.jsx").Type,
    AppCfg = require("../../app_config.js"),
    Moment = require("moment")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Coupon, Store.Plan), BuildableList],

  statics: {
    willTransitionTo: function(transition, params){
      if(!Store.Educator.hasActiveApp("coupon"))
        transition.redirect(AppCfg.getByName("coupon").route)
    }
  },

  getDefaultProps: function() {
    return {humanType: "Coupon", type: "COUPON", icon: "ticket"}
  },

  getStoreState: function() {
    return {
      coupons: Store.Coupon.getCoupons()
    }
  },

  render: function(){

    function detailsText (e) {
      var courseLink
      if (e.links.course) {
        courseLink = <Link to={"/admin2/courses/" + e.links.course + "/dashboard"}>
          {"course " + e.links.course}
        </Link>
      } else {
        courseLink = "all courses"
      }
      return <span>{e.reductionValue}% off on {courseLink}</span>
    }

    function usedText (e) {
      return <span>{e.nUsed} / {e.maximumUsage ? e.maximumUsage : "∞"}</span>
    }

    return this.renderBuildableList(this.state.coupons, {
      actions: ['delete'],
      cells: [
        {label: "Coupon Code", type: Type.text(e => e.couponCode), clickable: false, sort: "couponCode"},
        {label: "Details", type: Type.text(detailsText), clickable: false, sort: "reductionValue"},
        {label: "Usage?", type: Type.text(usedText), clickable: false, sort: "nUsed"},
        {label: "Expiration", type: Type.date(e => e.validUntil, "never"), clickable: false, sort: "validUntil"},
        {label: "Active?", type: Type.toggle({attribute: "enabled", type: "COUPON"}), clickable: false, sort: e => e.enabled?1:0},
      ],
      sort: e => e.couponCode,
      filterLabel: ["coupon code"],
      filter: function(e, search){
        return e.couponCode.toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      csvDownloadFields: [
        ["id", "coupon_ID"], ["createdAt", "creation_date"], ["couponCode", "coupon_code"],
        ["reductionValue", "reduction_value_%"],[ "links.course", "limited_to_course_ID"],
        ["nUsed", "times_used"], ["maximumUsage", "maximum_usage"],
        ["validUntil", "expiration_date"], ["enabled", "is_active"]
      ],
      csvFilePrefix: "coupons"
    })
  }
})