var React = require("react"),
    Link = require("react-router").Link,
    moment = require("moment"),
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
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {humanType: "User", type: "USER", unsubmittable: true}
  },

  render: function(){
    var {user} = this.props

    var model = _.extend(copy(_.omit(user, "links")))
    model.emailOptin = model.emailOptin ? "yes" : "no"
    model.birthday = model.birthday ? moment(model.birthday).format("L") : null

    return this.renderEdit(model, [
      {name: "title", readonly: true},
      {name: "firstname", readonly: true},
      {name: "surname", readonly: true},
      {name: "company", readonly: true},
      {name: "birthday", readonly: true},
      {name: "gender", readonly: true},
      {name: "locale", readonly: true},
      {name: "currency", readonly: true},
      {name: "email", readonly: true},
      {name: "emailOptin", readonly: true},
      {name: "phone", readonly: true},
      {name: "street", readonly: true},
      {name: "streetNo", readonly: true},
      {name: "city", readonly: true},
      {name: "country", readonly: true}
    ])
  }
})