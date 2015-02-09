var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    {copy, findImageUrl} = require('../../util.js'),
    AppCfg = require("../../app_config.js"),
    Store = require("../../stores/flux/store.js")

var Show = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    educator: React.PropTypes.object.isRequired,
    favicon: React.PropTypes.object
  },

  statics: {
    willTransitionTo: function(transition, params){
      if(!Store.Educator.hasActiveApp("customtemplates"))
        transition.redirect(AppCfg.getByName("customtemplates").route)
    }
  },

  getDefaultProps: function(){
    return {humanType: "Website", type: "EDUCATOR"}
  },

  render: function(){
    var {educator, favicon} = this.props

    var model = _.extend(copy(_.omit(educator, "links")), {
      favicon: favicon ? {id: favicon.id, url: findImageUrl(favicon)} : null
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "favicon", type: Type.media({assemblyType: "favicon", accept: "image/*"})},
      {name: "brandColor", type: Type.color(), rules: [Validator.required()]},
      {name: "customStyle", type: Type.multiText()}
    ])
  }
})

module.exports = Show