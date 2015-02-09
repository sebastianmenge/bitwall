var React = require("React"),
    ButtonState = require("../../mixins/button_state.js"),
    Store = require("../../stores/flux/store.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    StoreState = require("../../mixins/store_state.js"),
    cx = require("react/addons").addons.classSet

var SubmitButton = React.createClass({
  mixins: [ButtonState, StoreState(Store.Processing)],
  getStoreState: function(){
    return {
      processing: Store.Processing.getCurrentState()
    }
  },
  componentDidMount: function() {
    Store.Processing.init()
  },

  render: function(){
    var classes = cx({
      btn: true,
      "btn-primary-action": true,
      "btn-large": this.props.large == true,
    })
    return <button disabled={this.buttonState()} type="submit" className={classes}>{this.props.label}</button>
  }
})

module.exports = SubmitButton
