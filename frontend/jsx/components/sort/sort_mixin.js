var React = require("react"),
    _ = require("underscore");

var RESERVED_PROPS = {'domType':true,'id':true,'active':true,'showPlaceholder':true,'dragEnd':true,'children':true,'onDragEnd':true, 'setDragging':true};

module.exports = {
  renderDomType: function(opts, children) {
    var newProps = opts||{};
    _.forEach(_.keys(this.props), function(prop) {
      if (!RESERVED_PROPS[prop]) {
        newProps[prop] = this.props[prop]
      }
    }, this)
    return React.DOM[this.props.domType](newProps, children);
  }
}