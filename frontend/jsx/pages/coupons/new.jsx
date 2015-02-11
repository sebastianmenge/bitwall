var React = require("react"),
    Link = require("react-router").Link,
    Form = require("../../components/form/form.jsx"),
    StoreState = require("../../mixins/store_state"),
    Store = require("../../stores/flux/store"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context"),
    Buildable = require("../../mixins/buildable.jsx")


module.exports = React.createClass({
  mixins: [PageContext, Buildable, StoreState(Store.Course, Store.Coupon)],

  getDefaultProps: function() {
    return {humanType: "Coupon", type: "COUPON"}
  },

  getStoreState: function() {
    return {
      courses: Store.Course.getCourses(),
      coupons: Store.Coupon.getCoupons()
    }
  },


  render: function() {
    var model = {},
        allCouponNames = _.map(this.state.coupons, e => e.couponCode)
        allCourses = _.map(this.state.courses, function(e) {return {id: e.id, name: e.name}});

    return this.renderBuild(model, [
      {name: "couponCode",      type: Type.upperCaseText(), rules: [Validator.required(), Validator.maxLength(20), Validator.regex(/^[\w-]+$/), Validator.uniqueFromList(allCouponNames)]},
      {name: "reductionValue",  type: Type.int({addon: "%"}), rules: [Validator.required(), Validator.minValue(1), Validator.maxValue(100)]},
      {name: "course",          type: Type.chosen({options: allCourses, label: "name"})},
      {name: "maximumUsage",    rules: [Validator.regex(/^\d*$/)]},
      {name: "validUntil",      type: Type.date({minDate: new Date})}
    ])
  }
})
