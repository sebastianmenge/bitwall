var React = require('react'),
		{expandAuthCookie} = require("../util");

var KeepSessionAlive = React.createClass({
	componentDidMount: function(){
		document.body.addEventListener("mousemove", this._handleMouseMove);
	},

	_handleMouseMove: function(){
		expandAuthCookie();
	},

	componentWillUnmount: function (){
    document.body.removeEventListener("mousemove", this._handleMouseMove);
  },	

	render: function(){
		return null;
	}
});

module.exports = KeepSessionAlive;
