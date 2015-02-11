var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator"),
    Editable = require("../../mixins/editable.jsx"),
    PageContext = require("../../mixins/page_context"),
    Country = require("../../enums/enum").Country

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    educator: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      humanType: "Setting",
      type: "EDUCATOR"
    }
  },

  render: function() {

    return this.renderEdit(this.props.educator, [
      {name: "id", hidden: true},
      {name: "name", rules: [Validator.required()]},
      {name: "contractWebsite"},
      {name: "contractContactRepresentative", rules: [Validator.required()]},
      {name: "contractContactEmail", rules: [Validator.required()]},
      {name: "contractContactPhone"},
      {name: "contractStreet"},
      {name: "contractStreetNo"},
      {name: "contractCity"},
      {name: "contractState"},
      {name: "contractZip"},
      {name: "contractCountry", type: Type.chosenEnum({enumArr: Country, deselectable: false})},
      {name: "contractCompany"},
      {name: "contractVatNo"}
    ])
  }
})