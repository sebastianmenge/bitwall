var React = require("react"),
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js")

var Testimonials = React.createClass({
  mixins: [StoreState(Store.Testimonial)],

  getStoreState: function(){
    var testimonial = Store.Testimonial.getTestimonial(parseInt(this.props.params.testimonialId, 10))

    return {
      testimonial,
      mediaFile: Store.Testimonial.getFile(testimonial.links.mediaFile)
    }
  },

  render: function(){
    var {testimonial, mediaFile} = this.state
    return <this.props.activeRouteHandler testimonial={testimonial} mediaFile={mediaFile}/>
  }
})

module.exports = Testimonials