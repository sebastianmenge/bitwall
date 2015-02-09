var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context"),
    AppCfg = require("../../app_config"),
    TileListable = require("../../mixins/tile_listable.jsx");

var reportingTile = {
  label: "Patience Reporting",
  description: "Visualize all data relating to your revenue, student enrollments, signups and leads in interactive graphs!",
  route: "analytics/reporting",
  icon: "pa-icon-patience-reporting"
};

module.exports = React.createClass({

  mixins: [PageContext, TileListable],

  getDefaultProps: function(){
    return {
      title: "Get valuable insights about the performance of your platform and courses",
      numColumns: 2,
      entries: [reportingTile, _.find(AppCfg.entries,e => e.name == "panalytics")]
    }
  },

  render: function(){
    return this.renderTileList(this.props.entries)
  }
})
