var React = require("react"),
    Router = require("react-router"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Type = require("../../components/table.jsx").Type,
    Store = require("../../stores/flux/store.js"),
    Listable = require("../../mixins/listable.jsx")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.User), Listable],

  getStoreState: function(){
    return {users: Store.User.getUsers()}
  },

  getDefaultProps: function(){
    return {humanType: "User", type: "USER"}
  },

  render: function(){
    return this.renderList(this.state.users, {
      cells: [
        {label: "Signed up",      type: Type.date(e => e.createdAt),    sort: "createdAt"},
        {label: "Name",           type: Type.text(e => e.ui.fullname),  sort: e => e.firstname+'_'+e.surname},
        {label: "Email",          type: Type.text(e => e.email),        sort: "email"},
        {label: "Last Login",     type: Type.date(e => e.lastLogin ),   sort: "lastLogin"},
        {label: "Is Admin?",      type: Type.toggle({type: "USER", attribute: "isAdmin"}), sort: e => e.isAdmin ? 1 : 0}
      ],
      actions: ["show"],
      sort: e => e.createdAt,
      sortOrder: -1,
      filterLabel: ["firstname", "lastname", "email"],
      filter: function({firstname, surname, email}, search){
        return (firstname + " " + surname + " " + email).toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      csvDownloadFields: [
        ["id", "user_ID"], ["createdAt", "signup_date"], ["email", "email"],
        ["title", "title"], ["firstname", "firstname"], ["surname", "lastname"],
        ["birthday", "birthday"], ["gender", "gender"], ["phone", "phone"],
        ["country", "country"], ["locale", "language"], ["currency", "currency"],
        ["emailOptin", "email_opt_in"], ["emailVerified", "email_verified"],
        ["updatedAt", "last_update"], ["isAdmin", "is_admin"], ["lastLogin", "last_login"]
      ],
      csvFilePrefix: "users"
    })
  }
})
