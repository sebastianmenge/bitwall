var React = require("react"),
    Store = require("../../stores/flux/store"),
    StoreState = require("../../mixins/store_state.js")

var TextQuestions = React.createClass({
  mixins: [StoreState(Store.Course)],
  getStoreState: function(){
    var textQuestion = Store.Course.getTextQuestion(parseInt(this.props.params.questionId, 10));

    return {textQuestion}
  },
  render: function(){
    return <this.props.activeRouteHandler textQuestion={this.state.textQuestion}/>
  }
})

module.exports = TextQuestions