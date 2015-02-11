var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    {copy} = require("../../util.js"),
    Buildable = require('../../mixins/buildable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

module.exports = React.createClass({
  mixins: [Buildable, PageContext, StoreState(Store.Course)],

  getDefaultProps: function(){
    return {humanType: "Multiple Choice Question", type: "MC_QUESTION", afterBuildRoute: "quizzes/questions"}
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
    var model = {
      question: "",
      mcQuestionOptions: [],
      description: "",
      quizId: this.props.params.quizId
    }

    return this.renderBuild(model, [
      {name: "id", hidden: true},
      {name: "quizId", hidden: true},
      {name: "question",    rules: [Validator.required()], caption: 'Edit the content of this question'},
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