var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    Listable = require("../../mixins/listable.jsx"),
    StoreState = require("../../mixins/store_state"),
    Store = require("../../stores/flux/store"),
    Type = require("../../components/table.jsx").Type,
    Table = require("../../components/table.jsx"),
    ActionButtons = require("../../components/table/action_buttons.jsx"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    FileUpload = require("../../components/file_upload.jsx")


module.exports = React.createClass({
  mixins: [PageContext, Listable, StoreState(Store.Course)],

  propTypes: {
    lecture: React.PropTypes.object.isRequired
  },

  getDefaultProps: function(){
    return {humanType: "Attachment", type: "ATTACHMENT"}
  },

  getStoreState: function(){
    return {
      attachments: Store.Course.getLearnUnitAttachments(this.props.lecture.links.learnUnitAttachments)
    }
  },

  onFinished: function(file) {
    Store.Course._files.push(file)
    Dispatcher.handleViewAction({
      type: "LEARN_UNIT_ATTACHMENT_CREATE",
      values: {learnUnitId: this.props.lecture.id, title: file.name, fileId: file.id}
    })
  },

  render: function(){

    var tableDescriptor = {
      actions: [
        ((e) => <ActionButtons.Delete key="delete" type="LEARN_UNIT_ATTACHMENT" model={e}/>)
      ],
      cells: [
        {label: "Name", type: Type.editableText({type: "LEARN_UNIT_ATTACHMENT", attribute: "title"}), primary: true, expand: true},
        {label: "Type", type: Type.icon(e => e.ui.fileType)}
      ],
      noSearchBox: true,
      noPagination: true,
      rowAction: function(e){
        window.open(e.ui.fileUrl, '_blank')
      },
      filter: function(e, search){
        return e.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
      }
    }


    var {attachments} = this.state

    var contentDiv
    if (attachments.length === 0) {
      contentDiv = <div className="empty-list">
        <i className="fa fa-paperclip"></i>

        <span className="headline">You have no attachments yet</span>
      </div>
    } else {
      contentDiv = <Table entries={attachments} tableDescriptor={tableDescriptor}/>
    }

    return <div className="ebe-content-area">
      {contentDiv}

      <FileUpload
        onUploaded={this.onFinished}
        uploaderId={"learn_unit_attachment-"+this.props.lecture.id}
        hidePreview={true}
      />
    </div>
  }
})

