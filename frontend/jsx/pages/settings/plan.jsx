var React = require("react"),
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js"),
    UpgradePlan = require("../../components/upgrade_plan.jsx"),
    PageContext = require("../../mixins/page_context")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Plan)],

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    return {planData: Store.Plan.getPlanData(this.props.educator)}
  },

  render: function(){
    var {educator} = this.props
    return <UpgradePlan planData={this.state.planData}/>
  }
})