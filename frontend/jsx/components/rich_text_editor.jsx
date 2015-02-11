var React = require("react"),
    AutoFocusMixin = require("react/lib/AutoFocusMixin"),
    Scribe = require("scribe-editor"),
    HTMLJanitor = require("html-janitor"),
    scribePluginToolbar = require('scribe-plugin-toolbar'),
    scribePluginInlineStyles = require('scribe-plugin-inline-styles-to-elements'),
    scribePluginLinkPromptCommand = require('scribe-plugin-link-prompt-command'),
    scribePluginSanitizer = require('scribe-plugin-sanitizer'),
    _ = require("underscore");

var sanitzationOptions = {
  tags: {
    h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
    p: true, ul:true, li:true, ol:true,blockquote:true,
    b: true, i: true, u:true, strike:true,
    table: true, tr: true, td: true, th: true, tbody: true, thead: true, tfoot: true,
    a: {
      href: true,
      target: '_blank'
    },
    img: {
      src: true,
      alt: true,
      width: true,
      height: true
    }
  }
}

var buttons = [
  {
    name:'bold',
    icon:'bold',
    label: null,
    title:'bold',
  },
  {
    name:'italic',
    icon:'italic',
    label: null,
    title:'italic',
  },
  {
    name:'strikeThrough',
    icon:'strikethrough',
    label: null,
    title:'strike through',
  },
  {
    name:'removeFormat',
    icon: null,
    label:'remove Format',
    title:'remove Format',
  },
  {
    name:'linkPrompt',
    icon:'chain',
    label: null,
    title:'add link',
  },
  {
    name:'unlink',
    icon:'unlink',
    label: null,
    title:'unlink',
  },
  {
    name:'insertOrderedList',
    icon:'list-ol',
    label: null,
    title:'insert ordered list',
  },
  {
    name:'insertUnorderedList',
    icon:'list-ul',
    label: null,
    title:'insert unordered list',
  },
  {
    name:'indent',
    icon:'indent',
    label: null,
    title:'indent',
  },
  {
    name:'outdent',
    icon:'outdent',
    label: null,
    title:'outdent',
  },
  {
    name:'blockquote',
    icon:'quote-left',
    label: null,
    title:'blockquote',
  },
  {
    name:'h2',
    icon:'header',
    label: null,
    title:'heading',
  },
  {
    name:'undo',
    icon:'rotate-left',
    label: null,
    title:'undo',
  },
  {
    name:'redo',
    icon:'rotate-right',
    label: null,
    title:'redo',
  }
]

var RichtTextEditor = React.createClass({

  mixins: [AutoFocusMixin],

  statics: {
    sanitize: function(value){
      return new HTMLJanitor(sanitzationOptions).clean(value);
    }
  },

  getInitialState: function() {
    return {inHtmlMode: false};
  },

  _onChange: function() {
    this._isChanging = true;
    var html = this._scribe.getHTML();
    if (html!==this.props.value) this.props.onChange.call(this,html);
    this._isChanging = false;
  },


  _onChangeHtmlMode: function(e) {
    this._isChanging = true;
    this.props.onChange.call(this,e.target.value);
    this._isChanging = false;
  },

  shouldComponentUpdate: function(newProps, newState) {
    if (this._isChanging) return false;
    if (this.state.inHtmlMode != newState.inHtmlMode || newState.inHtmlMode) return true;
    return !(this._scribe && this._scribe.getHTML() == this.props.value);
  },

  componentDidMount: function() {
    this._setUpScribe();
  },

  componentWillUnmount: function() {
    _.forEach(document.body.querySelectorAll("em.scribe-marker"),function(node){node.remove()});
  },

  componentDidUpdate: function() {
    this._setUpScribe();
  },

  _clickHtmlMode: function() {
    if (!this.state.inHtmlMode) _.forEach(document.body.querySelectorAll("em.scribe-marker"),function(node){node.remove()});
    this.setState({inHtmlMode:!this.state.inHtmlMode});
  },

  _setUpScribe: function() {
    if (this.state.inHtmlMode) return;
    var scribeNode = this.refs.scribe.getDOMNode();
    if (!scribeNode.hasAttribute('contenteditable')) {
      // Setup Scribe
      this._scribe = new Scribe(scribeNode);
      this._scribe.use(scribePluginToolbar(this.refs.toolbar.getDOMNode()));
      this._scribe.use(scribePluginInlineStyles());
      this._scribe.use(scribePluginLinkPromptCommand());
      if (this.props.onChange) this._scribe.on('content-changed', this._onChange);
    }
    this._scribe.setContent(this.props.value)
  },

  render: function() {
    return this.state.inHtmlMode ? this._renderHtmlMode() : this._renderScribe();
  },

  _renderHtmlModeButton: function() {
    return this.props.htmlModeEnabled ? <button type="button" className="btn btn-default" title="enter html mode" onClick={this._clickHtmlMode}>
          <span className="fa fa-code"></span>
        </button> : null;
  },

  _renderHtmlMode: function() {
    return <div>
      <div ref="toolbar" className="scribe-toolbar btn-group">
        {this._renderHtmlModeButton()}
      </div>
      <textarea ref="htmlEditor" className="form-control" value={this.props.value} onChange={this._onChangeHtmlMode}></textarea>
    </div>
  }, 

  _renderScribe: function() {
    var buttonEls = buttons.map(function(button) {
      var icon = button.icon ? <span className={"fa fa-"+button.icon}></span> : null;
      return <button key={button.name} type="button" className="btn btn-default" data-command-name={button.name} title={button.title}>{icon}{button.label}</button>
    });
    return <div>
      <div ref="toolbar" className="scribe-toolbar btn-group">
        {this._renderHtmlModeButton()}
        {buttonEls}
      </div>
      <div ref="scribe" className="scribe-editor form-control"></div>
    </div>
  }
});

IeRichTextEditor = React.createClass({

  statics: {
    sanitize: function(value){
      return value;
    }
  },

  render: function() {
    return this.transferPropsTo(<textarea className="form-control"/>)
  }
});

function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
};

module.exports = (!detectIE() && window.getSelection && document.createRange && window.MutationObserver) ? RichtTextEditor : IeRichTextEditor;
