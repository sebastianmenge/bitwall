var React = require("react"),
    UploadStore = require('../stores/upload_store'),
    moment = require("moment"),
    {expandAuthCookie} = require("../util"),
    cookies = require("cookies-js"),
    findImageUrl = require("../util.js").findImageUrl,
    _ = require('underscore'),
    _str = require("underscore.string");

require("moment-duration-format");

var messages = {
  initialising: null,
  uploading: "file upload in progress",
  processing: <span>the file was successfully uploaded! conversion in progress… <i className="fa fa-spinner fa-spin"></i></span>,
  aborted: null
}

var FileUpload = React.createClass({

  getInitialState: function() {
    return {
      upload: {
        uploading: false,
        progress: {type: null}
      }
    };
  },

  componentWillMount: function() {
    var upload = UploadStore.listen(this.props.uploaderId, this.onChange);
    if (upload) this.onChange("CHANGE",upload);
  },

  componentDidMount: function() {
    if (this.props.originalFile) UploadStore.resumeConversion(this.props.uploaderId, this.props.originalFile);
  },

  componentWillUnmount: function() {
    UploadStore.unlisten(this.props.uploaderId, this.onChange);
  },

  onChange: function(type, upload) {
    switch(type){
      case "CHANGE":
        expandAuthCookie(60*24);
        this.setState({
          upload: upload
        });
        break;
      case "KILL":
        this.setState({
          upload: upload
        })
        break;
      case "DONE":
        this.setState({
          upload: upload
        })
        if (this.props.onUploaded) this.props.onUploaded(upload.fileOnDb);
        break;
      case "CREATED_DB_ENTRY":
        if (this.props.onFileCreated) this.props.onFileCreated(upload.fileOnDb);
    };
  },

  checkForMimeType: function(file) {
    var currentType = file.type,
        acceptedTypes = this.props.accept || '',
        acceptedTypesText = '',
        isAccepted = null;

    if (!currentType) {
      isAccepted = true;
    } else if (_.isArray(acceptedTypes)) {
      isAccepted = _.find(acceptedTypes, (type)=>{ return currentType.match(type) })
      acceptedTypesText = (_.map(acceptedTypes, (type)=>{ return type.split('/')[0] })).join('/')
    } else {
      isAccepted = currentType.match(acceptedTypes);
      acceptedTypesText = acceptedTypes.split('/')[0]
    }

    var errMsg = "This file type is not supported. Please select " + acceptedTypesText + " file.";

    if (!isAccepted) this.setState({upload: {errorMessage: errMsg, progress: {type: 'filetype'}}})
    return isAccepted
  },

  handleFile: function() {
    var files = this.refs.input.getDOMNode().files;
    if (!files.length) return;
    var file = files[0];
    var typeAccepted = this.checkForMimeType(file);
    if (!typeAccepted) return;
    // store previous file url if user interrupts unsaved upload
    this[_str.camelize(this.props.uploaderId)] = this.props.originalFile || null;

    UploadStore.startUpload(this.props.uploaderId, file, this.props.postUploadFn);
  },

  handleAbort: function() {
    UploadStore.cancelUpload(this.props.uploaderId, this.props.onCancelUpload);
  },

  createProgressBar: function() {
    var timeLeft = null;
    if (this.state.upload.millisLeft > 0) {
      timeLeft = <span>{moment.duration(this.state.upload.millisLeft, "milliseconds").format("d[d] h[h] mm[m] ss[s]")}&nbsp;left - </span>;
    }
    var abortButton = this.state.upload.progress.type=='uploading' ? <button  className="btn btn-secondary-action" onClick={this.handleAbort}>Cancel</button> : null;
    var interruptInfo = this.state.upload.progress.type=='uploading' ? <p className='info-text'>Please do not close or refresh the window while uploading.</p> : null;

    return <div>
      <div className="progress">
        <div className="progress-bar progress-bar-striped active"  role="progressbar" style={{width: this.state.upload.progress.percentage+"%"}}>
          <span>{timeLeft}{messages[this.state.upload.progress.type]}</span>
        </div>
      </div>
      {abortButton}
      {interruptInfo}
    </div>
  },

  createUploader: function() {
    return <label className="file-picker">
      <span>Upload a new file</span>
      <input type="file" onChange={this.handleFile} ref="input"/>
      <p className='uploading-error'>{this.state.upload.errorMessage}</p>
    </label>
  },


  render: function() {
    var {uploading, progress} = this.state.upload
    var noMedia = <div className="file-empty"><i className="fa fa-image"></i></div>,
        processing = <div className="file-uploading"><i className="fa fa-refresh fa-spin"></i></div>
        // displaying default status
        mediaDiv = null;

    if (uploading) {
      mediaDiv = this.state.upload.previewSrc ? <img src={this.state.upload.previewSrc} height="50"/> : processing
    }

    if (!uploading) {
      var regex = /\.(jpg|gif|jpeg|ico|png|tif|bmp)$/i,
          url = null;

      switch (progress.type) {
        case 'canceled':
          url = this[_str.camelize(this.props.uploaderId)] ? this[_str.camelize(this.props.uploaderId)].url : null;
          break;
        default:
          if (window['lastUploaded'+this.props.uploaderId]) {
            url = findImageUrl(window['lastUploaded'+this.props.uploaderId]);
          } else {
            url = (this.props.originalFile) ? this.props.originalFile.url : null;
          }
      }
      (url && url.match(regex)) ? (mediaDiv = <img src={url} height="50"/>) : (mediaDiv = noMedia);
    }

    var content = uploading ? this.createProgressBar() : this.createUploader()
    return (
      <div>
        <div className="file-uploader">
          <div className="file-uploader-preview">
            {mediaDiv}
          </div>
          <div className="file-uploader-caption">
            {content}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FileUpload;
