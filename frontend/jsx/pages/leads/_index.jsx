var React = require("react"),
    Router = require("react-router"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Type = require("../../components/table.jsx").Type,
    Store = require("../../stores/flux/store.js"),
    Listable = require("../../mixins/listable.jsx")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Lead), Listable],

  getStoreState: function(){
    return {leads: Store.Lead.getLeads()}
  },

  getDefaultProps: function(){
    return {humanType: "Lead", type: "LEAD"}
  },

  render: function(){
    return this.renderList(this.state.leads, {
      cells: [
        {label: "Pre-registered on",      type: Type.date(e => e.createdAt),    sort: "createdAt"},
        {label: "Email",              type: Type.text(e => e.email),        sort: "email"}
      ],
      actions: [],
      sort: e => e.createdAt,
      sortOrder: -1,
      filterLabel: ["email"],
      filter: function({email}, search){
        return (email).toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      csvDownloadFields: [
        ["createdAt", "interested_at"],
        ["email", "email"]
      ],
      csvFilePrefix: "leads"
    })
  }
})
