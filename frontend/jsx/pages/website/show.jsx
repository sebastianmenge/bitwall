var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    {copy, findImageUrl} = require('../../util.js')

var Show = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    educator: React.PropTypes.object.isRequired,
    pageBgImage: React.PropTypes.object,
    pagePromoVideo: React.PropTypes.object,
    pageTeaserImage: React.PropTypes.object,
    allCourses: React.PropTypes.array.isRequired,
    allTestimonials: React.PropTypes.array.isRequired,
    allInstructors: React.PropTypes.array.isRequired,
    featuredCourses: React.PropTypes.array.isRequired,
    featuredTestimonials: React.PropTypes.array.isRequired,
    featuredInstructors: React.PropTypes.array.isRequired,
    logo: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {humanType: "Website", type: "EDUCATOR", pageBgImage: null, pagePromoVideo: null, pageTeaserImage:null}
  },

  render: function(){
    var {educator, pageBgImage, pagePromoVideo, pageTeaserImage, allCourses, featuredCourses,
          allInstructors, featuredInstructors, allTestimonials, featuredTestimonials, logo} = this.props

    var model = _.extend(copy(_.omit(educator, "links")), {
      pageBgImage: pageBgImage ? {id: pageBgImage.id, url: findImageUrl(pageBgImage)} : null,
      pagePromoVideo: pagePromoVideo ? {id: pagePromoVideo.id, url: findImageUrl(pagePromoVideo)} : null,
      pageTeaserImage: pageTeaserImage ? {id: pageTeaserImage.id, url: findImageUrl(pageTeaserImage)} : null,
      logo: logo ? {id: logo.id, url: findImageUrl(logo)} : null,
      featuredCourses: featuredCourses,
      featuredInstructors: featuredInstructors,
      featuredTestimonials: featuredTestimonials
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "pageHeading", rules: [Validator.maxLength(120)]},
      {name: "pageSubheading", rules: [Validator.maxLength(120)]},
      {name: "pageBgImage", type: Type.media({assemblyType: "generic_image", accept: "image/*", defaultUrlPath: "backgroundUrl"})},
      {name: "logo",    type: Type.media({assemblyType: "logo", accept: "image/*"})},
      {name: "pagePromoVideo", type: Type.media({assemblyType: "generic_video", accept: "video/*"})},
      {name: "pageTeaserImage", type: Type.media({assemblyType: "generic_image", accept: "image/*", defaultUrlPath: "teaserImageUrl"})},
      {name: "pageShowSignupBox", type: Type.toggle({on: "on", off: "off"})},
      {name: "pageAboutText", type: Type.richText({htmlModeEnabled: true})},

      {name: "featuredCourses",    opts: {style: "pick", all: allCourses, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]},

      {name: "featuredInstructors",    opts: {style: "pick", all: allInstructors, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]},

      {name: "featuredTestimonials",    opts: {style: "pick", all: allTestimonials, label: "name"}, type: [
        {name: "id", readonly: true, hidden: true},
        {name: "name", readonly: true}
      ]},

      {name: "socialExternalWebsite",   type: Type.text({addon:"http://"}), caption: "Social Links"},
      {name: "socialFacebook",          type: Type.text({addon:"https://www.facebook.com/"})},
      {name: "socialTwitter",           type: Type.text({addon:"https://twitter.com/"})},
      {name: "socialGoogleplus",        type: Type.text({addon:"https://plus.google.com/"})},
      {name: "socialLinkedin",          type: Type.text({addon:"https://www.linkedin.com/"})},
      {name: "socialYoutube",           type: Type.text({addon:"https://www.youtube.com/"})}
    ])
  }
})

module.exports = Show