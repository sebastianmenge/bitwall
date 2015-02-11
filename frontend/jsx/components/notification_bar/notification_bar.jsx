var React = require("react"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js"),
    Link = require("react-router").Link,
    _ = require("underscore");

module.exports = React.createClass({

  mixins: [StoreState(Store.Educator)],

  getInitialState: function() {
    return {opened:true}
  },

  getStoreState: function(){
    return {
      educator: Store.Educator.getEducatorAny()
    }
  },

  handleLinkClick: function(e) {
    // if (window.ga) window.ga('send', 'event', 'notification-bar-link', 'click', e.target.className);
  },

  _handleCloseClick: function() {
    this.setState({opened: false});
    this.props.onNotificationClose && this.props.onNotificationClose();
  },

  render: function(){
    if (!this.state.opened || !this.state.educator) return null;

    var MESSAGES = {
      // 'basic_old': [
      //   <span><Link className="VAR1_1" to="settings/plan" onClick={this.handleLinkClick}>Upgrade now</Link> to save <b>25%</b> on all paid plans - forever! Coupon code: <b>APPAPPHOORAY</b></span>
      // ],
      'free': [
        <span><Link className="VAR2_1" to="settings/plan" onClick={this.handleLinkClick}>Upgrade now</Link> to get a lot of great apps and lower transaction fee</span>
      ]
    }


    var messages = MESSAGES[this.state.educator.plan];
    if (!messages) return null;
    return <div className="notiBar-container">
      {_.sample(messages)}
      <a onClick={this._handleCloseClick} className="close">
        <i className="fa fa-times-circle"></i>
      </a>
    </div>
  }
})
