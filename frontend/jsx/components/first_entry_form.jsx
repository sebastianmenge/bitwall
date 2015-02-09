var React = require("react"),
    cx = require("react/addons").addons.classSet,
    HeroForm = require("./form/hero_form.jsx"),
    Type = require("./form/type.jsx"),
    Validator = require("./form/validator.js")

var T = {
  "TESTIMONIAL.title": "You haven't added any testimonials yet",
  "TESTIMONIAL.button": "Create your first testimonial now",
  "TESTIMONIAL.placeholder": "Enter a testimonial title",
  "TESTIMONIAL.error": "Please enter the testimonial title",

  "INSTRUCTOR.title": "You haven't added any instructors yet",
  "INSTRUCTOR.button": "Create your first instructor now",
  "INSTRUCTOR.placeholder": "Enter the instructor name",
  "INSTRUCTOR.error": "Please enter the instructor name",

  "COURSE.title": "You haven't created any courses yet",
  "COURSE.button": "Create your first course now",
  "COURSE.placeholder": "Enter the course title",
  "COURSE.error": "Please enter the course title"
}

module.exports = React.createClass({

  propTypes: {
    rules: React.PropTypes.array.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },

  render: function(){
    var title = this.props.title || T[this.props.type+".title"] || "undefined.title",
        button = this.props.button || T[this.props.type+".button"] || "undefined.button",
        placeholder = this.props.placeholder || T[this.props.type+".placeholder"] || "undefined.placeholder",
        error = this.props.error || T[this.props.type+".error"] || "undefined.error",
        icon = this.props.icon || "fa-edit",
        iconClassName = "fa " + icon;

    var schema = []

    if(this.props.fieldName)
      schema.push({name: this.props.fieldName, rules: this.props.rules||[]})

    return <div className="empty-list">
      <i className={iconClassName}></i>

      <span className="headline">{title}</span>

      <HeroForm buttonLabel={button} schema={schema} onSubmit={this.props.onSubmit}/>

    </div>
  }
})