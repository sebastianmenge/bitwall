var React = require("react")

module.exports = React.createClass({
  render: function(){
    return <div className="dropbox-user">
      <ul className="fa-ul navigation-blocks">
        <li>
          <a href="#">
            <i className="fa fa-li fa-home"></i>
            Dashboard
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-li fa-list-ul"></i>
            Courses
          </a>
        </li>
        <li className="active">
          <a href="#">
            <i className="fa fa-li fa-users"></i>
            Users
          </a>
        </li>
      </ul>
    </div>
  }
})