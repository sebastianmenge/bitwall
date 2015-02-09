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
    mcQuestion: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function(){
    return {humanType: "Multiple Choice Question", type: "MC_QUESTION"}
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
    var {mcQuestion, mcQuestionOptions} = this.props
    var {allCourseLearnUnits} = this.state
    var learnUnitIds = this.props.mcQuestion.links.learnUnits

    var model = _.extend(copy(_.omit(mcQuestion, "links")), {
      mcQuestionOptions: mcQuestionOptions,
      learnUnits: _.filter(allCourseLearnUnits, e => _.contains(learnUnitIds, e.id))
    });

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "question", rules: [Validator.required()], caption: 'Edit the content of this question'},
      {name: "mcQuestionOptions", rules: [Validator.required(), Validator.minLength(2)], opts: {style: "addable"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "answer", type: Type.text({placeholder:"Type in an answer to the question"}), rules: [Validator.required()], label:"Option", opts: {expand: true, autofocusOnAdd: true}},
        {name: "correct", type: Type.toggle({on:"true", off:"false"}), defaultValue: false, label:"True/False?"}
      ]},
      {name: "description",   type: Type.richText()},
      {name: "learnUnits",  opts: {style: "pick", all: this.state.allCourseLearnUnits, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]}
    ])
  }
})