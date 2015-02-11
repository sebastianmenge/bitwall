var React = require("react"),
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js")

var Instructors = React.createClass({
  mixins: [StoreState(Store.Instructor)],

  getStoreState: function(){
    var instructor = Store.Instructor.getInstructor(parseInt(this.props.params.instructorId, 10))
    return {
      instructor: instructor,
      mediaFile: Store.Instructor.getFile(instructor.links.mediaFile)
    }
  },

  render: function(){
    var {instructor,mediaFile} = this.state
    return <this.props.activeRouteHandler instructor={instructor} mediaFile={mediaFile}/>
  }
})

module.exports = Instructors
