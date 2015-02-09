var React = require("react"),
    _ = require("underscore"),
    Bootstrap = require("react-bootstrap"),
    Router = require("react-router"),
    PageContext = require("../../mixins/page_context.js"),
    Type = require("../../components/table.jsx").Type,
    StoreState = require("../../mixins/store_state.js"),
    ButtonState = require("../../mixins/button_state.js"),
    Listable = require("../../mixins/listable.jsx"),
    Store = require("../../stores/flux/store.js"),
    AppCfg = require("../../app_config.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    Table = require("../../components/table.jsx"),
    ActionButtons = require("../../components/table/action_buttons.jsx")

module.exports = React.createClass({
  mixins: [ButtonState, PageContext, Listable, StoreState(Store.Course)],

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    return {
      courseItems: Store.Course.getCourseItems(this.props.course.links.courseItems),
      processing: Store.Processing.getCurrentState()
    }
  },
  componentDidMount: function() {
    Store.Processing.init()
  },

  getDefaultProps: function(){
    return {humanType: "Course Item", type: "COURSE_ITEM"}
  },

  headbarActions: function(){

    return <Bootstrap.DropdownButton bsStyle="primary" className="btn-primary-action" title="Add a new course item">
      <Bootstrap.MenuItem key="1" onClick={this.onClickCreateSection}>Add a new chapter</Bootstrap.MenuItem>
      <Bootstrap.MenuItem key="2" onClick={this.onClickCreateLecture}>Add a new lecture</Bootstrap.MenuItem>
      <Bootstrap.MenuItem key="3" onClick={this.onClickCreateQuiz}>Add a new quiz</Bootstrap.MenuItem>

    </Bootstrap.DropdownButton>
  },

  onClickCreateSection: function(){
    this.startProcessing()
    Dispatcher.handleViewAction({type: "SECTION_CREATE", values: {name: "My new Chapter", courseId: this.props.params.courseId}})
  },

  onClickCreateLecture: function(){
    this.startProcessing()
    Dispatcher.handleViewAction({type: "LECTURE_CREATE", values: {name: "My new Lecture", courseId: this.props.params.courseId}})
  },

  onClickCreateQuiz: function(){
    if(Store.Educator.hasActiveApp("quiz")){
      this.startProcessing()
      Dispatcher.handleViewAction({type: "QUIZ_CREATE", values: {name: "My new Quiz", courseId: this.props.params.courseId}})
    }else{
      Router.transitionTo(AppCfg.getByName("quiz").route)
    }
  },

  startProcessing: function() {
    Dispatcher.handleViewAction({type: "PROCESSING_START"})
  },

  render: function(){
    var {courseItems} = this.state,
        {course, params} = this.props

    var tableDescriptor = {
      actions: [
        ((e) => <ActionButtons.Delete key="delete" type="COURSE_ITEM" model={e}/>)
      ],
      cells: [
        {label: "Name", type: Type.editableText({type: "COURSE_ITEM", attribute: "name"}),   primary: true,  expand: true}
      ],
      rowAction: function(e){
        if(e.type == "LearnUnit"){
          var routeParams = _.extend(_.object([["lectureId", e.id]]), params)
          Router.transitionTo("lectures/show", routeParams)
        } else if(e.type == "Quiz"){
          var routeParams = _.extend(_.object([["quizId", e.id]]), params)
          Router.transitionTo("quizzes/show", routeParams)
        }
      },
      rowClassName: (e) => e.type,
      tableClassName: "no-strip",
      noRowHeader: true,
      noSearchBox: true,
      noPagination: true,
      sortable: true,
      sortAction: function(models){
        Dispatcher.handleViewAction({type: "COURSE_ITEM_SORT", models: models})
      },
    }

    var table = <Table entries={courseItems} tableDescriptor={tableDescriptor}/>

    return <div>
      {table}
      <button disabled={this.buttonState()} onClick={this.onClickCreateSection} className="btn btn-primary-action">Add a new chapter</button>
      &nbsp;<button disabled={this.buttonState()} onClick={this.onClickCreateLecture} className="btn btn-primary-action">Add a new lecture</button>
      &nbsp;<button disabled={this.buttonState()} onClick={this.onClickCreateQuiz} className="btn btn-primary-action">Add a new quiz</button>

    </div>
  }
})

