var React = require("react"),
    cx = require("react/addons").addons.classSet,
    HeroForm = require("./form/hero_form.jsx"),
    Type = require("./form/type.jsx"),
    Validator = require("./form/validator.js")

var T = {
  "COUPON.title": "You haven't created any coupons yet",
  "COUPON.button": "Create your first coupon now"
}

module.exports = React.createClass({

  propTypes: {
    link: React.PropTypes.object.isRequired
  },

  render: function(){
    var title = this.props.title || T[this.props.type+".title"] || "undefined.title",
        button = this.props.button || T[this.props.type+".button"] || "undefined.button",
        icon = this.props.icon || "fa-edit",
        iconClassName = "fa " + icon;

    return <div className="empty-list">
      <i className={iconClassName}></i>

      <span className="headline">{title}</span>

      {this.props.link}
    </div>
  }
})