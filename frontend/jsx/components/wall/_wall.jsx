var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    _ = require("underscore"),
    Row = require("./_row.jsx");

var Wall = React.createClass({
  mixins: [Router.State],
  displayName: "Wall",

  propTypes: {
    wall: React.PropTypes.object.isRequired,
  },

  render: function() {
    var {rows, notes} = this.props.wall,
        rows = _.map(rows, function(row) { return <Row notes={notes} rowNumber={parseInt(row)} key={row}/> });

    return <div className="wall">
      {rows}
    </div>

  }

})

module.exports = Wall
