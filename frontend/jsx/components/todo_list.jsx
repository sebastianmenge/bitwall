var React = require("react"),
    Link = require("react-router").Link,
    _ = require("underscore")

var TodoList = React.createClass({

  propTypes: {
    entries: React.PropTypes.array.isRequired
  },

  render: function(){
    var entries = _.map(this.props.entries, function(e){

      var link = Link(_.extend({to: e.route, className: "btn btn-primary-action btn-block"}, e.params||{}), e.linkLabel)

      return <div key={e.label} className="todo">
        <div className="row">
          <div className="col-xs-8">{e.label}</div>
          <div className="col-xs-4">
            {link}
          </div>
        </div>
      </div>
    }, this)

    return <div className="todo-list">
      {entries}
    </div>
  }
})

module.exports = TodoList