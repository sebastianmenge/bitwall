var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    AppConfig = require("../../app_config.js"),
    {Link} = require("react-router"),
    cx = require("react/addons").addons.classSet,
    Store = require("../../stores/flux/store");

module.exports = React.createClass({
  mixins: [PageContext],

  getDefaultProps: function(){
    return {
      entries: AppConfig.entries
    }
  },

  _renderEntry: function(entry) {
    var isActive = Store.Educator.hasActiveApp(entry.name);


    var tileClasses = cx({
      "apps-tile":true,
      "is-active":isActive
    });

    var link = isActive ?
      <Link className="apps-tile-cta-container" to={entry.route}>
        <div className="apps-tile-cta-label">App activated</div>
        <span className="apps-tile-cta-icon fa fa-check-circle"></span>
      </Link> :
      <Link className="apps-tile-cta-container" to={entry.route}>
        <div className="apps-tile-cta-label">Activate App</div>
        <span className="apps-tile-cta-icon fa fa-plus"></span>
      </Link>;

    return <div className={tileClasses} key={entry.name}>
      <Link className="apps-tile-icon-container" to={entry.route}>
        <span className={"pa-icon "+entry.icon}></span>
      </Link>
      <div className="apps-tile-title">{entry.label}</div>
      <div className="apps-tile-description" dangerouslySetInnerHTML={{__html: entry.description}}></div>
      {link}
    </div>
  },

  render: function(){
    return <div className="apps-list-container">
      <h3>Add additional apps to improve your platform experience and marketing success</h3>
      <div className="apps-list">
        {_.map(this.props.entries, this._renderEntry)}
      </div>
    </div>
  }
})