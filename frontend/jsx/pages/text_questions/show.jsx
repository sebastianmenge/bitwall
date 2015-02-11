var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    {copy} = require("../../util.js"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext, StoreState(Store.Course)],

  propTypes: {
    textQuestion: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function(){
    return {humanType: "Text Question", type: "TEXT_QUESTION"}
  },

  getStoreState: function(){
    var course = Store.Course.getCourse(this.props.params.courseId)
    var allCourseLearnUnits = Store.Course.getLectures(course.links.learnUnits)
    _.each(allCourseLearnUnits, function (e, i) {
      e.name = (i + 1) + " - " + e.name
    })
    return {allCourseLearnUnits}
  },

  render: function(){

    var {allCourseLearnUnits} = this.state
    var learnUnitIds = this.props.textQuestion.links.learnUnits

    var model = _.extend(copy(_.omit(this.props.textQuestion, "links")), {
      learnUnits: _.filter(allCourseLearnUnits, e => _.contains(learnUnitIds, e.id))
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "question",    rules: [Validator.required()], caption: 'Edit the content of this question'},
      {name: "answerText",  type: Type.richText(), rules: [Validator.required()]},
      {name: "learnUnits",  opts: {style: "pick", all: this.state.allCourseLearnUnits, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]}
    ])
  }
})