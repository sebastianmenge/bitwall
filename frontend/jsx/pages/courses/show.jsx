var React = require("react"),
    Link = require("react-router").Link,
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    copy = require("../../util.js").copy,
    findImageUrl = require("../../util.js").findImageUrl,
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext, StoreState(Store.Educator, Store.Course, Store.Instructor, Store.Testimonial)],

  propTypes: {
    course: React.PropTypes.object.isRequired,
    educator: React.PropTypes.object.isRequired
  },

  getStoreState: function(){
    var course = this.props.course

    return {
      allInstructors: Store.Instructor.getInstructors(),
      allTestimonials: Store.Testimonial.getTestimonials(),
      courseInstructor: Store.Instructor.getInstructor(course.links.instructor),
      courseTestimonials: Store.Testimonial.getTestimonials(course.links.testimonials)
    }
  },

  getDefaultProps: function(){
    return {humanType: "Course", type: "COURSE"}
  },

  render: function(){
    var {course, educator, teaserImage, promoVideo, pageBgImage} = this.props,
        {allInstructors, allTestimonials, courseInstructor, courseTestimonials} = this.state

    var model = _.extend(_.omit(copy(course), "links"), {
      testimonials: courseTestimonials,
      instructor: courseInstructor,
      teaserImage: teaserImage ? {id: teaserImage.id, url: findImageUrl(teaserImage)} : null,
      promoVideo: promoVideo ? {id: promoVideo.id, url: findImageUrl(promoVideo)} : null,
      pageBgImage: pageBgImage ? {id: pageBgImage.id, url: findImageUrl(pageBgImage)} : null
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "name",            rules: [Validator.required(), Validator.maxLength(60)], caption: "Edit your Course Page details"},
      //{name: "slug",            type: Type.text({addon:"http://"+educator.domain+"/"})},
      // {name: "published",       type: Type.toggle({on: "published", off: "unpublished"})},

      {name: "heading",         type: Type.text(), rules: [Validator.maxLength(120)]},
      {name: "subtitle",        type: Type.text(), rules: [Validator.maxLength(120)]},

      {name: "teaserImage",   type: Type.media({assemblyType: "generic_image", accept: "image/*", defaultUrlPath: "imageUrl"})},
      {name: "promoVideo",    type: Type.media({assemblyType: "generic_video", accept: "video/*"})},
      {name: "pageBgImage",   type: Type.media({assemblyType: "generic_image", accept: "image/*", defaultUrlPath: "backgroundUrl"})},

      {name: "benefits",        type: Type.richText()},
      {name: "description",     type: Type.richText({htmlModeEnabled: true})},

      {name: "instructor",      type: Type.chosen({options: allInstructors, label: "name"})},
      {name: "rating",          type: Type.float(), rules: [Validator.maxValue(5.0)]},

      {name: "testimonials",    opts: {style: "pick", all: allTestimonials, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]}
    ])
  }
})
