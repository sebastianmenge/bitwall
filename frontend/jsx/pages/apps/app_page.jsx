var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    _ = require("underscore"),
    _str = require("underscore.string"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    {copy, findImageUrl} = require('../../util.js'),
    StoreState = require("../../mixins/store_state"),
    AppCfg = require("../../app_config.js"),
    UpgradePlan = require("../../components/upgrade_plan.jsx"),
    Store = require("../../stores/flux/store"),
    Promise = require("bluebird"),
    {Link} = require("react-router");

var AppPage = React.createClass({
  mixins: [Editable, PageContext, StoreState(Store.Plan)],

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {humanType: "App", type: "EDUCATOR"}
  },

  getStoreState: function() {

    var {educator} = this.props,
        app = AppCfg.getByRoute(this.props.routeName),
        isAppActive = Store.Educator.hasActiveApp(app.name)

    return {
      planData: Store.Plan.getPlanData(this.props.educator),
      showUpgradePlan: false,
      fields: _.map(app.fields.call(app, educator, Store), function(f){
        var copy = _.clone(f)
        copy.name = "app" + _str.capitalize(app.name) + _str.capitalize(f.name)
        copy.readonly = !isAppActive

        return copy
      })
    }
  },

  onActiveChange: function(newValue){
    if(newValue){
      if(Store.Educator.isAppQuotaExceeded()){
        this.setState({showUpgradePlan: true})
      }else{
        _.each(this.state.fields, e => e.readonly = false)
        // this.setState({fields: _.clone(this.state.fields)})
        this.forceUpdate()
      }
    }else{
      _.each(this.state.fields, e => e.readonly = true)
      // this.setState({fields: _.clone(this.state.fields)})
      this.forceUpdate()
    }
  },

  render: function(){
    var {educator} = this.props,
        {showUpgradePlan} = this.state,
        app = AppCfg.getByRoute(this.props.routeName)

    if(showUpgradePlan)
      return <UpgradePlan planData={this.state.planData} exceededAppQuota={true}/>

    if(app.soon)
      return <div>The {app.label}-App is coming soon</div>

    var appActivePropOnEducator = "app" + _str.capitalize(app.name) + "Active";

    var allFields = _.union([
      {name: "id", hidden: true},
      {name: appActivePropOnEducator, type: Type.toggle({on: "On", off: "Off", postEl: val => val ? null : <span className="appPage-active-hint"><span className="fa fa-arrow-left"></span> Click here to activate this App</span>}), onChange: this.onActiveChange, labelValue: "Activate App", hintValue: "", formGroupClasses: {"is-highlighted": true}}
    ], this.state.fields)

    var formModel = app.formModel ? app.formModel.call(app, educator, Store) : educator;

    var featuresEl = app.features && app.features.length ? <div className="appPage-features">
      <h4>Features</h4>
      <ul>
        {app.features.map(f => <li className="appPage-feature-item">{f}</li>)}
      </ul>
    </div> : null;

    var findItEl = app.findIt && educator[appActivePropOnEducator] ? <div className="appPage-findit">
      <h4>You can find it here</h4>
      {app.pageRoute ?
        <Link className="appPage-page-link-on-img" to={app.pageRoute}>
          <img src={app.findIt} className="img-responsive" width="343"/>
        </Link> :
        <img src={app.findIt} className="img-responsive" width="343"/>
      }
    </div> : null;

    var pageLinkLabel = app.pageLinkLabel || 'Go to app';
    var pageLinkEl = app.pageRoute && educator[appActivePropOnEducator] ? <Link className="appPage-page-link" to={app.pageRoute}>
      {pageLinkLabel} <span className="fa fa-caret-right"></span>
    </Link> : null;

    var launchPageLink = (app.name == 'launch') && educator[appActivePropOnEducator] ? <a className="appPage-page-link" target='_blank' href={"http://"+educator.domain+"/launch"}>
      {pageLinkLabel} <span className="fa fa-caret-right"></span>
    </a> : null;

    return <div className="appPage-container">
      <h3>{app.label}</h3>
      <div className="appPage-description" dangerouslySetInnerHTML={{__html: app.description}}></div>
      {featuresEl}
      <div className="appPage-form">
        {this.renderEdit(formModel, allFields)}
      </div>
      {findItEl}
      {pageLinkEl}
      {launchPageLink}
    </div>
  }
})

module.exports = AppPage
