var React = require("react"),
    Store = require("../../stores/flux/store"),
    StoreState = require("../../mixins/store_state.js")

var Lectures = React.createClass({
  mixins: [StoreState(Store.Course)],
  getStoreState: function(){
    var lecture = Store.Course.getLecture(parseInt(this.props.params.lectureId, 10))

    return {
      lecture: lecture,
      mediaFile: Store.Course.getFile(lecture.links.mediaFile)
    }
  },
  render: function(){
    var {lecture, mediaFile} = this.state

    return <this.props.activeRouteHandler
      lecture={lecture}
      mediaFile={mediaFile}/>
  }
})

module.exports = Lectures