var React = require("react"),
    Router = require("react-router"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Type = require("../../components/table.jsx").Type,
    Store = require("../../stores/flux/store.js"),
    Listable = require("../../mixins/listable.jsx"),
    formatMoney = require("../../util").formatMoney,
    Link = require("react-router").Link,
    Label = require('react-bootstrap/Label')

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Order), Listable],

  getStoreState: function(){
    return {
      orders: Store.Order.getOrders()
    }
  },

  getDefaultProps: function(){
    return {humanType: "Order", type: "ORDER"}
  },

  render: function(){
    var {orders} = this.state

    function formatPrice (e) {
      if (e.status === 'trial') {
        return ""
      } else if (e.offerAmount !== e.orderAmount) {
        return <span>
          <s>{formatMoney(e.offerAmount, e.currency)}</s>&nbsp;
          <span>{e.orderAmount === 0 ? "FREE" : formatMoney(e.orderAmount, e.currency)}</span>
        </span>
      } else {
        return <span>
          <span>{e.offerAmount === 0 ? "FREE" : formatMoney(e.offerAmount, e.currency)}</span>
        </span>
      }
    }

    function formatUser (e) {
      return <Link to="users/show" params={{userId:e.links.user}}>{e.userEmail}</Link>
    }

    function formatCourse (e) {
      return <Link to="courses/dashboard" params={{courseId:e.links.course}}>{e.courseName}</Link>
    }

    function formatStatus (e) {
      var convert = {
        successful: "success",
        free: "success",
        processing: "warning",
        trial: "info",
        refunded: "default",
        failed: "danger"
      }
      return <Label bsStyle={convert[e.status]}>{e.status}</Label>
    }

    return this.renderList(orders, {
      cells: [
        {label: "Date",       type: Type.date(e => e.createdAt),    primary: false,  expand: false, sort: "createdAt"},
        {label: "Email",      type: Type.text(formatUser),          primary: false,  expand: false, sort: "email"},
        {label: "Course",     type: Type.text(formatCourse),        primary: false,  expand: false, sort: "courseName"},
        {label: "Amount Paid",type: Type.text(formatPrice),         primary: false,  expand: false, sort: "orderAmount"},
        {label: "Coupon",     type: Type.text(e => e.couponCode),   primary: false,  expand: false, sort: "couponCode"},
        {label: "Status",     type: Type.text(formatStatus),        primary: false,  expand: false, sort: "status"}
      ],
      sort: e => e.createdAt,
      sortOrder: -1,
      filterLabel: ["course name", "email", "coupon code"],
      filter: function(e, search){
        return ((e.couponCode||"") + e.userEmail + e.courseName).toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      csvDownloadFields: [
        ["id", "order_ID"], ["createdAt", "date"], ["userEmail", "user_email"],
        ["links.course", "course_ID"], ["courseName", "course_name"],
        ["offerAmount", "full_price_cents"], ["orderAmount", "paid_price_cents"],
        ["currency", "currency"], ["couponCode", "coupon_code"],
        ["status", "status"], ["trialPeriodSeconds", "trial_period_seconds"]
      ],
      csvFilePrefix: "orders"
    })
  }
})