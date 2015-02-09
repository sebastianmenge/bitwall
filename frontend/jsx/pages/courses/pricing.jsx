var React = require("react"),
    _ = require("underscore"),
    {copy} = require("../../util.js"),
    PageContext = require("../../mixins/page_context.js"),
    Validator = require("../../components/form/validator.js"),
    Editable = require("../../mixins/editable.jsx"),
    Type = require("../../components/form/type.jsx")

module.exports = React.createClass({
  mixins: [PageContext, Editable],

  propTypes: {
    course: React.PropTypes.object.isRequired,
    offer: React.PropTypes.object
  },

  prepareSubmitUpdate: function(values){
    if (!values.trialPeriodSeconds) values.trialPeriodSeconds = 0
    return values
  },

  getDefaultProps: function(){
    return {humanType: "Offer", type: "OFFER"}
  },

  render: function(){
    var {course, offer} = this.props

    var model = _.extend(_.omit(copy(offer), "id"), {
      courseId: course.id
    })
    return this.renderEdit(model, [
      {name: "courseId", hidden: true},
      {
        name: "amount", 
        type: Type.money({currency: model.currency}), 
        rules: [Validator.required()], 
        caption: 'Edit the pricing options of your course'
      },
      {name: "trialPeriodSeconds", type: Type.duration({units:['minutes','hours','days','weeks']})}
    ], true)
  }
})