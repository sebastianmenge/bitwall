var React = require("react"),
    Link = require("react-router").Link,
    cx = require("react/addons").addons.classSet,
    cloneWithProps = require("react/lib/cloneWithProps.js"),
    _ = require("underscore"),
    Breadcrumb = require("./breadcrumb.jsx"),
    PageContextStore = require("../stores/page_context_store.js"),
    StoreState = require("../mixins/store_state.js"),
    NotificationBar = require("./notification_bar/notification_bar.jsx");

module.exports = React.createClass({
  mixins: [StoreState(PageContextStore)],

  propTypes: {
    isSidebarCollapsed: React.PropTypes.bool.isRequired,
    toggleSidebar: React.PropTypes.func.isRequired
  },

  getStoreState: function(){
    return {
      activeRoute: PageContextStore.getActiveRoute(),
      params: PageContextStore.getParams(),
      page: PageContextStore.getPage()
    }
  },

  render: function(){
    var sidbebarToggleClassNames = cx({
      "fa": true,
      "fa-bars": true,
      "fa-flip-horizontal": this.props.isSidebarCollapsed
    })

    var {page} = this.state,
        headbarActions = null

    if(page && page.headbarActions)
      headbarActions = page.headbarActions()

    return <div className="ebe-header">
      <NotificationBar onNotificationClose={this.props.onNotificationClose}/>
      <div className="ebe-header-sidebar">
        <a onClick={this.props.toggleSidebar} className="collapse-icon" title="Collapse sidebar">
          <i className={sidbebarToggleClassNames}></i>
        </a>
        <div className="pull-right">
          <a onClick={this.props.handleLogout} title="Logout">
            <span><i className="fa fa-sign-out"></i></span>
          </a>
        </div>
        <span className="ebe-header-edu-label">{this.props.educator.domain}</span>
      </div>
      <div className="ebe-header-content">
        <Breadcrumb/>
        <div className="pull-right ebe-header-actions">
          {headbarActions}
        </div>
      </div>
    </div>
  }
})
