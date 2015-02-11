var React = require("react"),
    FileUpload = require('./file_upload.jsx'),
    UploadStore = require('../stores/upload_store'),
    req = require("../stores/lib/req.js"),
    Promise = require("bluebird"),
    cookies = require("cookies-js");

var AssemblyUpload = React.createClass({

  propTypes: {
    onFileCreated: React.PropTypes.func,
    onFinished: React.PropTypes.func,
    originalFile: React.PropTypes.object,
    type: React.PropTypes.string.isRequired,
    accept: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
    name: React.PropTypes.string.isRequired,
    modelId: React.PropTypes.any.isRequired
  },

  getInitialState: function() {
    return {
      assembly: null
    };
  },

  _postUploadFn: function(upload, emitChangeFn) {
    var data = {
      type: this.props.type,
      fileId: upload.fileOnDb.id,
      modelId: this.props.modelId,
      uploaderId: upload.uploaderId
    };
    upload.progress.type="processing";
    upload.millisLeft = -1;
    emitChangeFn();
    return req("post","/ebe-api2/media_assemblies", data, "mediaAssemblies").then(function(media_assemblies) {
      return media_assemblies[0];
    }).then(UploadStore.pollTillDone);
  },

  _onFileCreated: function(file) {
    if (this.props.onFileCreated) this.props.onFileCreated(file);
  },

  _onFinished: function(file) {
    if (this.props.onFinished) this.props.onFinished(file);
  },

  _onCancelUpload: function(file) {
    if (this.props.onCancelUpload) this.props.onCancelUpload(file);
  },

  _uploaderId: function() {
    return "assembly-"+this.props.type+"-"+this.props.name+"-"+this.props.modelId;
  },

  render: function() {
    return (
      <FileUpload
        originalFile={this.props.originalFile}
        onCancelUpload={this._onCancelUpload}
        postUploadFn={this._postUploadFn}
        onFileCreated={this._onFileCreated}
        onUploaded={this._onFinished}
        uploaderId={this._uploaderId()}
        pollProcessStatus={this._pollTillDone}
        accept={this.props.accept}
      />
    )
  }
});

module.exports = AssemblyUpload;
