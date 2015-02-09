var React = require("react"),
    TileListable = require("../../mixins/tile_listable.jsx")
    PageContext = require("../../mixins/page_context")

module.exports = React.createClass({
  mixins: [PageContext, TileListable],

  getDefaultProps: function() {
    return {
      title: "Your Patience platform settings",
      numColumns: 2,
      entries: [
        {
          icon: "fa-gear",
          label: "Account Details",
          description: "Fill in the details of your Patience account.",
          route: "settings/account_data"
        },
        {
          icon: "fa-money",
          label: "Payout Information",
          description: "Provide all the information needed to pay you.",
          route: "settings/payout_info"
        },
        {
          icon: "fa-suitcase",
          label: "Patience Plan",
          description: "View &amp; update the details of your Patience Plan.",
          route: "settings/plan"
        }
      ]
    }
  },

  render: function () {
    return this.renderTileList(this.props.entries)
  }
})