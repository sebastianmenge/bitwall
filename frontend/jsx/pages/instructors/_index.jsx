var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Validator = require("../../components/form/validator.js"),
    Type = require("../../components/table.jsx").Type,
    Store = require("../../stores/flux/store.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    CreatableList = require("../../mixins/creatable_list.jsx")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Instructor), CreatableList],

  getStoreState: function(){
    return {instructors: Store.Instructor.getInstructors()}
  },

  getDefaultProps: function(){
    return {humanType: "Instructor", type: "INSTRUCTOR", createFieldName: "name", rules: [Validator.required()]}
  },

  render: function(){
    return this.renderCreateOrList(this.state.instructors, {
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