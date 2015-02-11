var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    {copy, findImageUrl} = require('../../util.js'),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    testimonial: React.PropTypes.object.isRequired,
    mediaFile: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {humanType: "Testimonial", type: "TESTIMONIAL"}
  },

  render: function(){
    var {testimonial,mediaFile} = this.props

    var model = _.extend(copy(_.omit(testimonial, "links")), {
      mediaFile: mediaFile ? {id: mediaFile.id, url: findImageUrl(mediaFile)} : null
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "name",      rules: [Validator.required(), Validator.maxLength(60)], caption: "Testimonial Profile"},
      {name: "headline", rules: [Validator.maxLength(120)]},
      {name: "mediaFile", type: Type.media({assemblyType: "generic_square_image", accept: "image/*", defaultUrlPath: "imageUrl"})},
      {name: "quote", type: Type.richText()},
      {name: "email"},
      {name: "website",     type: Type.text({addon:"http://"}), caption: "Social Links"},
      {name: "facebook",    type: Type.text({addon:"https://www.facebook.com/"})},
      {name: "twitter",     type: Type.text({addon:"https://twitter.com/"})},
      {name: "googleplus",  type: Type.text({addon:"https://plus.google.com/"})},
      {name: "linkedin",    type: Type.text({addon:"https://www.linkedin.com/"})},
      {name: "youtube",     type: Type.text({addon:"https://www.youtube.com/"})}
    ])
  }
})