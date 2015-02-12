var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    Link = Router.Link,
    _ = require("underscore")

var WallNav = React.createClass({
  displayName: "WallNav",

  propTypes: {
    walls: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired
  },

  render: function() {
    var {walls, rows} = this.props,
        wallsList = _.map(walls, function(wall) {
          return <li key={wall.id}><Link to="wall" params={{wallId: wall.id}}>{wall.name}</Link></li>
        }),
        rows = _.map(rows, function(row) {
          return <li key={row}><span>{row}</span></li>
        })

    return <header>
      <ul className="menu-list all-walls">
        {wallsList}
        <li className="new-wall">
          <button>+ New wall</button>
        </li>
      </ul>

      <ol className="menu-list all-rows">
        <li className="new-row">
          <button>+ New row</button>
        </li>
        {rows}
      </ol>

      <div className="logo"></div>
    </header>
  }
})

module.exports = WallNav;
