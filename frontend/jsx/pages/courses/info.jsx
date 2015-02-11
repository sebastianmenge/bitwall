var React = require("react"),
    _ = require("underscore"),
    Link = require("react-router").Link,
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    PageContext = require("../../mixins/page_context.js"),
    {copy} = require("../../util.js"),
    Editable = require('../../mixins/editable.jsx'),
    Enum = require("../../enums/enum.js")

module.exports = React.createClass({
  mixins: [PageContext, Editable],

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {humanType: "Course", type: "COURSE"}
  },

  render: function(){
    var {course, educator} = this.props

    var model = _.extend(_.omit(copy(course), "links"), {

    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "language",      type: Type.chosenEnum({enumArr: Enum.Language}), caption: "Course Info"},
      {name: "courseLevel",   type: Type.chosenEnum({enumArr: Enum.CourseLevel})},
      {name: "category",      type: Type.chosenEnum({enumArr: Enum.CourseCategory})},
      {name: "tags",          type: Type.tags({options: educator.tags})},
      {name: "workload",      type: Type.duration({units:['minutes','hours','days','weeks']})},
      {name: "sku", rules: [Validator.maxLength(30)]},
      {name: "goal", type: Type.richText(), caption: "Frequently Asked Questions (FAQ)", captionDetail: "Add your answers to the most common questions your students might have. You can edit and/or remove the default values. If you leave a field empty, the respective FAQ will not be shown in the course page."},
      {name: "audience", type: Type.richText()},
      {name: "prerequisites", type: Type.richText()},
      {name: "satisfactionWarranty", type: Type.richText()},
      {name: "accessRules", type: Type.richText()},
      {name: "courseDuration", type: Type.richText()}
    ])
  }
})