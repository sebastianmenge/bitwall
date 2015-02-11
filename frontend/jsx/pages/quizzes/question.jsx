var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    Table = require("../../components/table.jsx"),
    Type = require("../../components/table.jsx").Type,
    ActionButtons = require("../../components/table/action_buttons.jsx"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js"),
    Router = require("react-router"),
    Bootstrap = require("react-bootstrap");

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Course)],

  propTypes: {
    quiz: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    return {
      questions: Store.Course.getQuestions(this.props.quiz.links.questions)
    }
  },

  onClickCreateTextQuestion: function() {
    Router.transitionTo("textQuestions/new", this.props.params)
  },

  onClickCreateMcQuestion: function() {
    Router.transitionTo("mcQuestions/new", this.props.params)
  },


  headbarActions: function(){

    return <Bootstrap.DropdownButton bsStyle="primary" className="btn-primary-action" title="Add a new question">
      <Bootstrap.MenuItem onClick={this.onClickCreateTextQuestion}>Add a Free Text question</Bootstrap.MenuItem>
      <Bootstrap.MenuItem onClick={this.onClickCreateMcQuestion}>Add a Multiple Choice question</Bootstrap.MenuItem>
    </Bootstrap.DropdownButton>
  },

  render: function(){

    var params = this.props.params;

    var tableDescriptor = {
      actions: [
        ((e) => <ActionButtons.Delete key="delete" type="QUESTION" model={e}/>)
      ],
      cells: [
        {label: "Question",   type: Type.editableText({type: "QUESTION", attribute: "question"}),   primary: true,  expand: true},
        {label: "Type",       type: Type.faIcon(e => (e.type === 'TextQuestion' ? 'file-text-o' : 'check-square-o'))}
      ],
      rowAction: function(e){
        var routeParams = _.extend(_.object([["questionId", e.id]]), params)
        if(e.type == "TextQuestion"){
          Router.transitionTo("textQuestions/show", routeParams)
        } else if(e.type == "McQuestion"){
          Router.transitionTo("mcQuestions/show", routeParams)
        }
      },
      rowClassName: (e) => e.type,
      noSearchBox: true,
      noPagination: true,
      sortable: true,
      sortAction: function(models){
        Dispatcher.handleViewAction({type: "QUESTION_SORT", models: models})
      },
    }

    var buttons = <div className="action-buttons">
        <button onClick={this.onClickCreateTextQuestion} className="btn btn-primary-action">
          Add a Free Text question
        </button>&nbsp;
        <button onClick={this.onClickCreateMcQuestion} className="btn btn-primary-action">
          Add a Multiple Choice question
        </button>
      </div>;
    if (this.state.questions.length) {
      return <div><Table entries={this.state.questions} tableDescriptor={tableDescriptor}/>
        {buttons}
      </div>
    } else {
      return (
        <div className="empty-list">
          <i className="fa fa-question"></i>
          <span className="headline">You have not added any questions yet</span>

          {buttons}
        </div>
        )
    }
  }
})

