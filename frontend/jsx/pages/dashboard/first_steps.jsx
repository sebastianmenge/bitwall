var React = require("react"),
    InstructorAvatar = require("../../components/instructor_avatar/instructor_avatar.jsx"),
    Link = require("react-router").Link,
    Store = require("../../stores/flux/store.js"),
    StoreState = require("../../mixins/store_state.js");

module.exports = React.createClass({
  mixins: [StoreState(Store.Instructor)],
  getStoreState: function(){
    var firstInstructor = _.min(this.props.educator.links.instructors);
    var instructor = (firstInstructor === Infinity) ? {} : Store.Instructor.getInstructor(parseInt(firstInstructor, 10));
    return {
      instructor: instructor
    }
  },
  render: function() {
    var {educator} = this.props,
        {instructor} = this.state,
        instructorAvatarUrl = instructor.ui ? instructor.ui.imageUrl : 'https://patience-live.s3.amazonaws.com/15508362324767-key-01da0936c800e141824e9d45f1aae9860b884b60.zFbZwaIc3l5OFxNmroGU_height640.png';

    return <div className='firstSteps'>
      <div className="page-title">
        <h1 className='firstSteps-headline'>Welcome, {educator.contractContactRepresentative}!</h1>
        <p className='firstSteps-subHeadline'>Congratulations! You’ve taken the first step toward creating your own online course.</p>
      </div>
      <InstructorAvatar imgUrl={instructorAvatarUrl}/>
      <ul className='firstSteps-steps'>
        <li>
          1. View your <a href={"http://"+educator.domain+"/launch"} target='_blank'>launch page </a> and <Link to='apps/launch'>customize</Link> it.
        </li>
        <li>2. Edit your <Link to='instructors'>instructor</Link> information.</li>
        <li>3. Now, you can start <Link to='courses'>creating</Link> your first course!</li>
      </ul>
    </div>
  }
})

