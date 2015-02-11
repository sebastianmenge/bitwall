var React = require("react"),
    _ = require("underscore"),
    Bootstrap = require("react-bootstrap"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Validator = require("../../components/form/validator.js"),
    Store = require("../../stores/flux/store.js"),
    Type = require("../../components/table.jsx").Type,
    UpgradePlan = require("../../components/upgrade_plan.jsx"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    CreatableList = require("../../mixins/creatable_list.jsx"),
    AppCfg = require("../../app_config.js"),
    copy = require("../../util.js").copy


var DomainStatusCell = React.createClass({
  mixins: [StoreState(Store.Educator)],

  getStoreState: function(){
    return {isRefreshing: Store.Educator.isDomainRefreshing(this.props.domain)}
  },

  propTypes: {
    domain: React.PropTypes.object.isRequired
  },

  onClick: function(){
    var {domain} = this.props
    Dispatcher.handleViewAction({type: "DOMAIN_DNS_REFRESH", id: domain.id, model: domain})
    return false
  },

  render: function(){
    var {domain: {status: {status, value}}} = this.props,
        {isRefreshing} = this.state,
        label = (status == "ok") ? "OK" : "Incorrect"

    if(isRefreshing)
      label += "..."

    label = <span>{label}</span>

    if(status != "ok"){
      var tooltip = "No CNAME record detected for this domain";
      if (value) {
        tooltip = <span>Found this CNAME entry: <pre>{value}</pre><br/>expected this: <pre>{this.props.educator.id+'-edu.patience.io'}</pre></span>
      }
      label = <Bootstrap.OverlayTrigger placement="left" overlay={<Bootstrap.Tooltip>{tooltip}</Bootstrap.Tooltip>}>
        {label}
      </Bootstrap.OverlayTrigger>
    }

    return <div>
      {label}
      <small>&nbsp;(<a onClick={this.onClick}>refresh</a>)</small>
    </div>
  }
})


module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Educator, Store.Plan), CreatableList],

  statics: {
    willTransitionTo: function(transition, params){
      if(!Store.Educator.hasActiveApp("customdomain"))
        transition.redirect(AppCfg.getByName("customdomain").route)
    }
  },

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    return {
      domains: Store.Educator.getDomains(this.props.educator.links.domains)
    }
  },

  getDefaultProps: function(){
    return {humanType: "Domain", type: "DOMAIN", createFieldName: "domain", rules: [Validator.required()]}
  },

  render: function(){
    return this.renderCreateOrList(this.state.domains, {
      actions: [],
      cells: [
        {label: "Domain Name",         type: Type.text(e => e.domain),                   primary: true,  expand: true, sort: "domain"},
        {label: "Status",         type: Type.component(e => <DomainStatusCell domain={e} educator={this.props.educator}/>),  expand: false},
        {label: "Default",        type: Type.toggle({type: "DOMAIN", attribute: "isDefault", disabled: e => e.status.status != 'ok' || e.isDefault}), primary: true,  expand: false, sort: e=>e.isDefault?1:0}
      ],
      sort: e => e.domain,
      filter: function(e, search){
        return e.domain.toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      noSearchBox: true,
      noPagination: true,
    })
  }
})