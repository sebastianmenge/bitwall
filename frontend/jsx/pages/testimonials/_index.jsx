var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Type = require("../../components/table.jsx").Type,
    Validator = require("../../components/form/validator.js"),
    Store = require("../../stores/flux/store.js"),
    AppCfg = require("../../app_config.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    CreatableList = require("../../mixins/creatable_list.jsx")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Testimonial), CreatableList],

  // statics: {
  //   willTransitionTo: function(transition, params){
  //     if(!Store.Educator.hasActiveApp("testimonial"))
  //       transition.redirect(AppCfg.getByName("testimonial").route)
  //   }
  // },

  getStoreState: function(){
    return {testimonials: Store.Testimonial.getTestimonials(this.props.educator.links.testimonials)}
  },

  getDefaultProps: function(){
    return {humanType: "Testimonial", type: "TESTIMONIAL", createFieldName: "name", rules: [Validator.required()]}
  },

  render: function(){
    return this.renderCreateOrList(this.state.testimonials, {
      actions: ["show","delete"],
      cells: [
        {label: "Image",        type: Type.image(e => e.ui.imageUrl),   primary: false, expand: false},
        {label: "Name",         type: Type.text(e => e.name),           primary: true,  expand: true, sort: "name"}
      ],
      filter: function(e, search){
        return e.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
      },
      sort: e => e.name,
      noSearchBox: true,
      noPagination: true,
    })
  }
})