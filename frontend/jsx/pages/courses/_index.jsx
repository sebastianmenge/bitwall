var React = require("react"),
    Router = require("react-router"),
    Link = require("react-router").Link,
    _ = require("underscore"),
    Type = require("../../components/table.jsx").Type,
    Validator = require("../../components/form/validator.js"),
    Promise = require("bluebird"),
    CreatableList = require("../../mixins/creatable_list.jsx"),
    PageContext = require("../../mixins/page_context.js"),
    StoreState = require("../../mixins/store_state.js"),
    Store = require("../../stores/flux/store.js"),
    copy = require("../../util.js").copy,
    Dispatcher = require("../../dispatchers/patience_dispatcher.js")

module.exports = React.createClass({
  mixins: [PageContext, StoreState(Store.Course), CreatableList],

  getStoreState: function(){
    return {courses: Store.Course.getCourses()}
  },

  getDefaultProps: function(){
    return {humanType: "Course", type: "COURSE", createFieldName: "name", rules: [Validator.required()]}
  },

  render: function(){
    return this.renderCreateOrList(this.state.courses, {
      actions: ["show", "delete"],
      cells: [
        {label: "Image",       type: Type.image(e => e.ui.imageUrl), primary: false, expand: false},
        {label: "Course Name", type: Type.text(e => e.name), sort: "name", primary: true,  expand: false, sort: e => e.name},
        {label: "Price",       type: Type.text(e => e.ui.price), primary: false, expand: false, sort: e => e.ui.rawPrice},
        {label: "Students",    type: Type.text(e => e.numNonTrials), primary: false, expand: false, sort: e => e.numNonTrials},
        {label: "Published?", type: Type.toggle({attribute: "published", type: "COURSE"}), sort: e => e.published ? 1 : 0, primary: false, expand: false}
      ],
      sort: e => e.id,
      sortOrder: -1,
      filter: function(c, search){
        return (c.id + c.name.toLowerCase()).indexOf(search.toLowerCase()) >= 0
      },
      filterLabel: ["course name"],
      showPage: "dashboard",
      csvDownloadFields: [
        ["id", "course_ID"], ["name", "course_name"], ["createdAt", "creation_date"],
        ["updatedAt", "last_update"], ["published", "is_published"]
      ],
      csvFilePrefix: "courses"
    })
  }
})
