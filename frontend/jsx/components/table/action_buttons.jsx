var React = require("react"),
    Router = require("react-router"),
    _ = require("underscore"),
    cx = require("react/addons").addons.classSet,
    Modal = require("../modal.jsx"),
    OverlayMixin = require('react-bootstrap').OverlayMixin,
    Dispatcher = require("../../dispatchers/patience_dispatcher.js")

var T = {
  "INSTRUCTOR": "Do you want to delete this instructor?",
  "COURSE": "Do you really want to delete this course?",
  "TESTIMONIAL": "Do you want to delete this testimonial?",
  "COURSE_ITEM": "Do you really want to delete this course item?",
  "LECTURE": "Do you want to delete this lecture?",
  "SECTION": "Do you want to delete this chapter?",
  "USER": "Do you want to delete this user?",
  "LEARN_UNIT_ATTACHMENT": "Do you want to delete this attachment?",
  "QUESTION": "Do you want to delete this question?",
  "COUPON": "Do you really want to delete this coupon?"
}

var Delete = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    model: React.PropTypes.shape({
      id: React.PropTypes.any.isRequired
    }).isRequired
  },
  toggle: function(){
    this.refs.modal.toggle()
  },
  render: function(){
    var title = T[this.props.type] || T[this.props.label] || "undefined"

    return <div>
      <Modal.Confirm ref="modal" title={title} primaryOnClick={this.onYesButtonClick}/>
      <Simple onClick={this.toggle} className={this.props.className} icon="fa fa-trash-o fa-color-red"/>
    </div>
  },
  onYesButtonClick: function(){
    Dispatcher.handleViewAction({type: this.props.type.toUpperCase() + "_DELETE", id: this.props.model.id})
    this.toggle()
  }
})


var Show = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    baseRoute: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    model: React.PropTypes.shape({
      id: React.PropTypes.any.isRequired
    }).isRequired
  },

  onClick: function(){
    var routeParams = _.extend(_.object([[this.props.type.toLowerCase()+"Id", this.props.model.id]]), this.props.params||{})
    Router.transitionTo(this.props.baseRoute + "/show", routeParams)
  },

  render: function(){
    return <Simple onClick={this.onClick} icon="fa-arrow-circle-right" className={this.props.className}/>
  }
})

var Simple = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired
  },

  render: function(){
    var className = cx({
      "table-action-button": true
    })

    if(this.props.className)
      className += " " + this.props.className

    return <a onClick={this.props.onClick} className={className}><i className={"fa " + this.props.icon}></i></a>
  }
})

module.exports = {
  Delete: Delete,
  Show: Show,
  Simple: Simple
}
