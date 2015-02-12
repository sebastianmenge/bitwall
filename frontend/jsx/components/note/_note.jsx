var React = require("react"),
    _ = require("underscore");

var Note = React.createClass({
  displayName: "Note",

  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  render: function() {
    var style = {borderTop: "3px solid "+this.props.color}
    return <div className='note-element' style={style}>

    </div>
  }

})

module.exports = Note;
