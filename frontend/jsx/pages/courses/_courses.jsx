var React = require("react"),
    Promise = require("bluebird"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

var Courses = React.createClass({
  mixins: [StoreState(Store.Educator, Store.Course)],

  getStoreState: function(){
    var course = Store.Course.getCourse(parseInt(this.props.params.courseId, 10))
    var statistic = Store.Statistic.getStatistic(course.id) || {numTrialsCurrentMonth: 0, numNonTrialsCurrentMonth: 0, revenueCurrentMonth: 0, numNonTrials: 0, id: course.id}
    return {
      educator: Store.Educator.getEducatorAny(),
      course: course,
      statistic: statistic,
      teaserImage: Store.Course.getFile(course.links.teaserImage),
      promoVideo: Store.Course.getFile(course.links.promoVideo),
      pageBgImage: Store.Course.getFile(course.links.pageBgImage),
      offer: Store.Course.getOffer(course.links.offer)
    }
  },

  render: function(){
    var {course, statistic, educator, teaserImage, promoVideo, pageBgImage, offer} = this.state
    return <this.props.activeRouteHandler
      course={course}
      statistic={statistic}
      educator={educator}
      teaserImage={teaserImage}
      promoVideo={promoVideo}
      pageBgImage={pageBgImage}
      offer={offer}
    />
  }
})

module.exports = Courses
