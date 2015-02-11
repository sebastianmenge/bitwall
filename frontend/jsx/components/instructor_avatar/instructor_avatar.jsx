var React = require("react"),
    Link = require("react-router").Link;

module.exports = React.createClass({
  render: function() {
    var boxShadow = this.props.boxShadow || '0 0px 0px 7px #f2f7f9, 0 0px 0px 8px rgba(0, 89, 129, 0.18)'
    var style = {
      width: this.props.width || '130px',
      boxShadow: boxShadow,
      WebkitBoxShadow: boxShadow
    };
    return (
      <Link to={this.props.LinkTo || 'instructors'} className='instructorAvatar' style={style}>
        <div className='instructorAvatar-wrapper'>
          <img className='instructorAvatar-placeholder' src="https://placehold.it/300x300"/>
          <img className='instructorAvatar-image' src={this.props.imgUrl}/>
        </div>
      </Link>
    )
  }
})

