var React = require("react"),
    Bootstrap = require('react-bootstrap'),
    _ = require("underscore")


var BaseModal = {
  mixins: [Bootstrap.OverlayMixin],
  getInitialState: function(){
    return {visible: false}
  },
  toggle: function(){
    if(this.isMounted())
      this.setState({visible: !this.state.visible})
  },
  hide: function(){
    if(this.isMounted())
      this.setState({visible: false})
  },
  show: function(){
    if(this.isMounted())
      this.setState({visible: true})
  },
  render: function(){
    return <span/>
  }
}

var Modal = React.createClass({
  mixins: [BaseModal],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    body: React.PropTypes.component.isRequired
  },
  renderOverlay: function(){
    if(!this.state.visible)
      return <span/>

    return <Bootstrap.Modal title={this.props.title} onRequestHide={this.toggle}>
      <div className="modal-body">
        {this.props.body}
      </div>
    </Bootstrap.Modal>
  }
})

var Confirm = React.createClass({
  mixins: [BaseModal],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    primaryOnClick: React.PropTypes.func.isRequired,
    primaryLabel: React.PropTypes.string,
    secondaryLabel: React.PropTypes.string,
    description: React.PropTypes.component
  },
  getDefaultProps: function(){
    return {primaryLabel: "Yes", secondaryLabel: "No"}
  },
  renderOverlay: function(){
    if(!this.state.visible)
      return <span/>

    var body = <div>
      <Bootstrap.Button className="btn btn-primary-action" onClick={this.props.primaryOnClick}>{this.props.primaryLabel}</Bootstrap.Button>
      &nbsp;<Bootstrap.Button className="btn btn-secondary-action" onClick={this.hide}>{this.props.secondaryLabel}</Bootstrap.Button>
    </div>

    return <Bootstrap.Modal title={this.props.title} onRequestHide={this.toggle}>
      <div className="modal-body">
        {this.props.description}
        {body}
      </div>
    </Bootstrap.Modal>
  }
})

var LeavePage = React.createClass({
  mixins: [BaseModal],
  getInitialState: function(){
    return {transition: null, form: null}
  },
  handleFormTransition: function(transition, form){
    if(!transition)
      throw "found no transition. call handleTransition() first"

    if(!form)
      throw "found no form. call handleTransition() first"

    if(!form.isDirty())
      return

    transition.abort()

    this.setState({transition: transition, form: form})
    this.show()
  },
  primaryOnClick: function(){
    var {form, transition} = this.state

    form
      .submit()
      .bind(this)
      .then(function(){
        this.hide()
        transition.retry()
      })
      .catch(function(){
        this.hide()
      })

  },
  secondaryOnClick: function(){
    var {form, transition} = this.state
    form.reset()
    this.hide()
    transition.retry()
  },
  renderOverlay: function(){
    if(!this.state.visible)
      return <span/>

    var body = <div className="text-center modal-buttons">
      <Bootstrap.Button className="btn btn-primary-action" onClick={this.primaryOnClick}>Save all changes</Bootstrap.Button>
      &nbsp;<Bootstrap.Button className="btn btn-secondary-action" onClick={this.secondaryOnClick}>Leave without saving</Bootstrap.Button>
    </div>

    var title = "You forgot to save a few changes..."

    return <Bootstrap.Modal title={title} onRequestHide={this.toggle}>
      <div className="modal-body">
        <p>It seems you forgot to save your work.<br />If you leave the page, all the changes that have not been saved will be lost.</p>
        {body}
      </div>
    </Bootstrap.Modal>
  }
})

Modal.Confirm = Confirm
Modal.LeavePage = LeavePage

module.exports = Modal