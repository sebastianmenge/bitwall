var React = require("react"),
    Link = require("react-router").Link,
    Form = require("../../components/form/form.jsx"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    Editable = require('../../mixins/editable.jsx'),
    {copy, findImageUrl} = require('../../util.js'),
    PageContext = require("../../mixins/page_context.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    instructor: React.PropTypes.object.isRequired,
    mediaFile: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {humanType: "Instructor", type: "INSTRUCTOR"}
  },

  render: function(){
    var {instructor,mediaFile} = this.props

    var model = _.extend(copy(_.omit(instructor, "links")), {
      mediaFile: mediaFile ? {id: mediaFile.id, url: findImageUrl(mediaFile)} : null
    })

    return this.renderEdit(model, [
      {name: "id", hidden: true},
      {name: "designation", caption: "Instructor Profile", rules: [Validator.maxLength(30)]},
      {name: "name",      rules: [Validator.required(), Validator.maxLength(60)]},
      {name: "headline", rules: [Validator.required(), Validator.maxLength(120)]},
      {name: "mediaFile", type: Type.media({assemblyType: "generic_square_image", accept: "image/*", defaultUrlPath: "imageUrl"})},
      {name: "biography",       type: Type.richText()},
      {name: "quote"},
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
