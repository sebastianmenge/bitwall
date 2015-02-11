var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    {copy,findImageUrl} = require("../../util.js"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    lecture: React.PropTypes.object.isRequired,
    mediaFile: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {humanType: "Lecture", type: "LECTURE"}
  },

  render: function(){

    var {lecture,mediaFile} = this.props

    var model = _.extend(_.omit(copy(lecture), "links"), {
      mediaFile: mediaFile ? {id: mediaFile.id, url: findImageUrl(mediaFile)} : null
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "name",                rules: [Validator.required(), Validator.maxLength(120)], caption: 'Edit the content of this lecture'},
      {name: "previewable",         type: Type.toggle({on: "Yes", off: "No"})},
      {name: "publicDescription",   rules: [Validator.maxLength(200)], caption: 'Edit the content of this lecture'},
      {name: "mediaFile",           type: Type.media({assemblyType: "course_item_content", accept: ["image/*", "video/*"]})},
      {name: "content",             type: Type.richText({htmlModeEnabled: true})}
    ])
  }
})
