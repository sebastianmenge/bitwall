var React = require("react"),
    _ = require("underscore"),
    _s = require('underscore.string'),
    Dispatcher = require("../dispatchers/patience_dispatcher.js"),
    Confirm = require("../components/modal.jsx").Confirm,
    moment = require("moment"),
    formatMoney = require("../util.js").formatMoney,
    Store = require("../stores/flux/store");

var UpgradePlan = React.createClass({

  propTypes: {
    feature: React.PropTypes.string,
    featurePlans: React.PropTypes.array,
    planData: React.PropTypes.shape({
      currentPlan: React.PropTypes.object.isRequired,
      currentSubscription: React.PropTypes.object,
      availablePlans: React.PropTypes.array.isRequired,
      hasRecurlyAccount: React.PropTypes.bool.isRequired,
      inTrial: React.PropTypes.bool.isRequired,
      trialTill: React.PropTypes.object
    }).isRequired
  },

  getInitialState: function(){
    return {changeToPlan: null, processing: false}
  },

  downgrade: function(){
    Dispatcher.handleViewAction({type: "CHANGE_PLAN", oldPlanId: this.props.planData.currentPlan.id, newPlanId: this.state.changeToPlan.id, hasRecurlyAccount: this.props.planData.hasRecurlyAccount})
    this.setState({processing: true})
    this.refs.downgradeModal.hide();
  },

  changePlan: function(oldPlan, newPlan){
    this.setState({changeToPlan: newPlan})
    if(newPlan.sortIndex < oldPlan.sortIndex){
      this.refs.downgradeModal.show();
    } else {
      this.setState({processing: true})
      Dispatcher.handleViewAction({type: "CHANGE_PLAN", oldPlanId: this.props.planData.currentPlan.id, newPlanId: newPlan.id, hasRecurlyAccount: this.props.planData.hasRecurlyAccount})
    }
  },

  render: function(){


    var {currentPlan, availablePlans, currentSubscription, couponRedemption, inTrial, trialTill} = this.props.planData

    function couponApplies() {
      return currentSubscription && couponRedemption && (!couponRedemption.planCodes || !couponRedemption.planCodes.length || _.include(couponRedemption.planCodes, currentSubscription.planCode));
    }
    function newPriceThroughCoupon() {
      var newCents = couponRedemption.discountType == "percent" ?
        currentSubscription.unitAmountInCents*(100-couponRedemption.discountPercent)/100 :
        currentSubscription.unitAmountInCents-couponRedemption.discountInCents;
      return formatMoney(Math.max(0,newCents), currentSubscription.currency);
    }

    var planChildren = _.map(availablePlans, function(e){

      var label = e.sortIndex < currentPlan.sortIndex ? "downgrade" : "upgrade",
          btnClass = e.sortIndex < currentPlan.sortIndex ? "btn btn-link downgrade-btn" : "btn btn-success"

      var spinner = this.state.processing && this.state.changeToPlan.id == e.id ? <i className="fa fa-refresh fa-spin fa-2x" style={{verticalAlign:"middle"}}></i> : null

      return <tr key={e.sortIndex}>
        <td>{e.longName}</td>
        <td>{e.priceLong}</td>
        <td>
          <button disabled={this.state.processing} onClick={this.changePlan.bind(this, currentPlan, e)} className={btnClass}>{label}</button>
          &nbsp;&nbsp;&nbsp;{spinner}
        </td>
      </tr>
    }, this)


    var downgradeDescription = <div>
      <p>By downgrading your current plan, you might <b>lose access to premium features</b> available only for selected plans.</p>
      <p>The Downgrading will take effect with the start of the new billing cycle.</p>
    </div>

    var currentPeriodEndsAtComp = currentSubscription ?
      <div className="plan-feature-item">
        <div className="plan-feature-value">{moment(currentSubscription.currentPeriodEndsAt).format("MMM Do, YYYY")}</div>
        <div className="plan-feature-label">next billing date</div>
      </div> : null;

    var trialEndsAtComp = inTrial && trialTill ?
      <div className="plan-feature-item">
        <div className="plan-feature-value">{moment(trialTill).format("MMM Do, YYYY")}</div>
        <div className="plan-feature-label">end of trial</div>
      </div> : null;

    // var featureComp = this.props.feature ? <div><h2>The <b>{this.props.feature}</b> feature is only available in {_s.toSentence(_.pluck(this.props.featurePlans, "shortName"))} plans.</h2><hr/></div> : null

    var titleComp = this.props.exceededAppQuota ? <div><h2>You have activated the maximum number of apps available for you plan. Upgrade your plan to use more apps!</h2><hr/></div> : null


    var additionalInfo = [];
    if (currentSubscription && currentSubscription.pendingPlan) {
      additionalInfo.push(<div key="downgrade" className="alert alert-info">Your plan will be downgraded to <b>{currentSubscription.pendingPlan}</b> at the end of this billing cycle.</div>);
    }
    if (currentSubscription && currentSubscription.state=='canceled') {
      additionalInfo.push(<div key="canceled" className="alert alert-warning">Your plan will be <b>canceled</b> at the end of this billing cycle.</div>);
    }
    if (couponRedemption) {
      console.log("couponRedemption", couponRedemption);
      var actuallySaving = null, savingAmount = null, duration = null, plans = null;
      if (couponApplies()) {
        actuallySaving = <span>So you‘re saving</span>;
      } else {
        actuallySaving = <span>So you would be saving</span>;
      }
      if (couponRedemption.discountType=="percent") {
        savingAmount = <span><b>{couponRedemption.discountPercent}%</b></span>;
      } else {
        savingAmount = <span><b>{formatMoney(couponRedemption.discountInCents,couponRedemption.currency)}</b></span>;
      }
      if (couponRedemption.appliesForMonths) {
        duration = <span>
          for {couponRedemption.appliesForMonths} months
          <span className="plan-coupon-alert-info-text"> (expires {moment(couponRedemption.createdAt).add(couponRedemption.appliesForMonths,'months').format("MMM Do, YYYY")})</span>
        </span>;
      }
      else if (couponRedemption.singleUse) {
        duration = <span>on the next payment(s)</span>;
      }
      if (couponRedemption.planCodes && couponRedemption.planCodes.length==1) {
        plans = <span>on the <b>{couponRedemption.planCodes[0]}</b> plan</span>
      }
      if (couponRedemption.planCodes && couponRedemption.planCodes.length>1) {
        plans = <span>on these plans: <b>{couponRedemption.planCodes.join(', ')}</b></span>
      }
      additionalInfo.push(<div key="couponRedemption" className="alert alert-info">
        You have redeemed the <b>{couponRedemption.name}</b> coupon. {actuallySaving} {savingAmount} {duration} {plans}
      </div>);
    }

    return <div>
      <Confirm  ref="downgradeModal"
                title="Do you really want to downgrade your plan?"
                description={downgradeDescription}
                primaryOnClick={this.downgrade}
                primaryLabel="Downgrade plan"
                secondaryLabel="Go back"/>

      {titleComp}

      <h3>Your Current Plan</h3>

      <div className="plan-feature-list">
        <div className="plan-feature-item">
          <div className="plan-feature-value">{currentPlan.shortName}</div>
          <div className="plan-feature-label">current plan</div>
        </div>
        <div className="plan-feature-item">
          {couponApplies() ?
            <div className="plan-feature-value">
              <s className="plan-feature-invalid-price">{currentPlan.price}</s>
              <span className="plan-feature-valid-price">
                {newPriceThroughCoupon()}
              </span>
            </div>
            :
            <div className="plan-feature-value">
              {inTrial ? <s className="plan-feature-invalid-price">{currentPlan.price}</s> : currentPlan.price}
            </div>
          }
          <div className="plan-feature-label">monthly fee</div>
        </div>
        <div className="plan-feature-item">
          <div className="plan-feature-value">{currentPlan.revShare}</div>
          <div className="plan-feature-label">transaction fee</div>
        </div>
        {currentPeriodEndsAtComp}
        {trialEndsAtComp}
        <div className="plan-feature-item">
          <div className="plan-feature-value">{Store.Educator.activeAppCount()} / {Store.Educator.getEducatorAny().appQuota}</div>
          <div className="plan-feature-label">apps used</div>
        </div>
      </div>

      {additionalInfo}

      <h3>Change Your Plan</h3>

      <p>The monthly fee is billed every month and the subscription is automatically renewed. Upgrading your plan takes effect immediately. Downgrades take effect when the current billing cycle is over. <u><a href="http://www.patience.io/pricing" target="_blank">Click here</a></u> if you need more information about our pricing and features.</p>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Price</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {planChildren}
        </tbody>
      </table>
    </div>
  }
})

module.exports = UpgradePlan
