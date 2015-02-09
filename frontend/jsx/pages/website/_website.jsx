var React = require("react"),
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js")

var Website = React.createClass({
  mixins: [StoreState(Store.Educator)],

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    var {educator} = this.props

    return {
      pageBgImage: educator.links.pageBgImage ? Store.Educator.getFile(educator.links.pageBgImage) : null,
      pagePromoVideo: educator.links.pagePromoVideo ? Store.Educator.getFile(educator.links.pagePromoVideo) : null,
      pageTeaserImage: educator.links.pageTeaserImage ? Store.Educator.getFile(educator.links.pageTeaserImage) : null,
      logo: educator.links.logo ? Store.Educator.getFile(educator.links.logo) : null,
      favicon: educator.links.favicon ? Store.Educator.getFile(educator.links.favicon) : null,
      allCourses: Store.Course.getCourses(),
      allTestimonials: Store.Testimonial.getTestimonials(),
      allInstructors: Store.Instructor.getInstructors(),
      featuredCourses: Store.Course.getCourses(educator.links.featuredCourses),
      featuredTestimonials: Store.Testimonial.getTestimonials(educator.links.featuredTestimonials),
      featuredInstructors: Store.Instructor.getInstructors(educator.links.featuredInstructors)
    }
  },

  render: function(){
    var {pageBgImage,pagePromoVideo,pageTeaserImage,allCourses,allTestimonials,allInstructors,
      featuredCourses,featuredTestimonials,featuredInstructors,logo,favicon} = this.state

    return <this.props.activeRouteHandler
      educator={this.props.educator}
      pagePromoVideo={pagePromoVideo}
      pageTeaserImage={pageTeaserImage}
      pageBgImage={pageBgImage}
      favicon={favicon}
      logo={logo}
      allCourses={allCourses}
      allTestimonials={allTestimonials}
      allInstructors={allInstructors}
      featuredCourses={featuredCourses}
      featuredTestimonials={featuredTestimonials}
      featuredInstructors={featuredInstructors}
    />
  }
})

module.exports = Website