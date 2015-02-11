var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator"),
    Editable = require("../../mixins/editable.jsx"),
    PageContext = require("../../mixins/page_context")

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {humanType: "Setting", type: "EDUCATOR"}
  },

  render: function() {

    return this.renderEdit(this.props.educator, [
      {name: "id", hidden: true},
      {name: "payoutPaypalEmail", captionDetail: "Please provide your PayPal address to receive the money for the courses that you have sold on your platform.<br>Patience will send you payments on a monthly basis, 30 days after the end of the month. If you prefer to receive payments via bank transfer or if you have any further questions, please write to <a href='mailto:payouts@patience.io'>payouts@patience.io</a>."
      }
    ])
  }
})