var React = require("react"),
    Type = require("../../components/form/type.jsx"),
    Validator = require("../../components/form/validator.js"),
    _ = require("underscore"),
    {copy,findImageUrl} = require("../../util.js"),
    Editable = require('../../mixins/editable.jsx'),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js")

module.exports = React.createClass({
  mixins: [Editable, PageContext],

  propTypes: {
    quiz: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {humanType: "Quiz", type: "QUIZ"}
  },

  render: function(){

    return this.renderEdit(this.props.quiz, [
      {name: "id",        hidden: true},
      {name: "name",      rules: [Validator.required(), Validator.maxLength(120)], caption: 'Edit the content of this Quiz'},
      {name: "content",   type: Type.richText({htmlModeEnabled: true})}
    ])
  }
})