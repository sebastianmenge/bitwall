var React = require("react"),
    Store = require("../../stores/flux/store"),
    StoreState = require("../../mixins/store_state.js")

var Quizes = React.createClass({
  mixins: [StoreState(Store.Course)],
  getStoreState: function(){
    var quiz = Store.Course.getQuiz(parseInt(this.props.params.quizId, 10))

    return {
      quiz: quiz
    }
  },
  render: function(){
    var {quiz} = this.state

    return <this.props.activeRouteHandler quiz={quiz}/>
  }
})

module.exports = Quizes