var React = require("react"),
    Store = require("../../stores/flux/store"),
    StoreState = require("../../mixins/store_state.js")

var McQuestions = React.createClass({
  mixins: [StoreState(Store.Course)],
  getStoreState: function(){
    var mcQuestion = Store.Course.getMcQuestion(parseInt(this.props.params.questionId, 10)),
        mcQuestionOptions = Store.Course.getMcQuestionOptions(mcQuestion.links.mcQuestionOptions);

    return {mcQuestion, mcQuestionOptions}
  },
  render: function(){
    return <this.props.activeRouteHandler
              mcQuestion={this.state.mcQuestion}
              mcQuestionOptions={this.state.mcQuestionOptions}
              />
  }
})

module.exports = McQuestions