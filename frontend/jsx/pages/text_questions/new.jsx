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
    return {humanType: "Text Question", type: "TEXT_QUESTION", afterBuildRoute: "quizzes/questions"}
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
    var model = {
      question: "",
      answerText: "",
      quizId: this.props.params.quizId
    }

    return this.renderBuild(model, [
      {name: "id", hidden: true},
      {name: "quizId", hidden: true},
      {name: "question",    rules: [Validator.required()], caption: 'Edit the content of this question'},
      {name: "answerText",  type: Type.richText(), rules: [Validator.required()]},
      {name: "learnUnits",  opts: {style: "pick", all: this.state.allCourseLearnUnits, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]}
    ])
  }
})