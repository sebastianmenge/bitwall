var React = require("react"),
    _ = require("underscore")

module.exports = React.createClass({

  propTypes: {
    entries: React.PropTypes.array.isRequired
  },

  render: function() {
    var entries = _.map(this.props.entries, function(e) {
      return <div className="statistics-item">
        <div className="statics-value">{e.value}</div>
        <div className="statics-label" dangerouslySetInnerHTML={{__html: e.label}}></div>
      </div>
    })

    return <div className="statistics-list">
      {entries}
    </div>
  }
})