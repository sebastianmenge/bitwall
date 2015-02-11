var React = require("react"),
    _ = require("underscore"),
    cx = require("react/addons").addons.classSet,
    Chosen = require("react-chosen")

var PickAndAdd = React.createClass({
  onChange: function(e){
    var v = e.target.value

    if(v.length){
      var field = this.props.field,
          entry = _.where(field.opts.all, {id: parseInt(v, 10)})[0]

      this.props.onAdd(field, entry)
    }
  },
  render: function(){
    var field = this.props.field,
        existing = _.map(field.value, function(v){
          return _.where(v, {name: "id"})[0].value
        }),
        remaining = _.reject(field.opts.all, function(e){
          return _.include(existing, e.id)
        }),
        optionLabelFor = function(option){
          return option.id.toString()
        }

    if(_.isString(field.opts.label))
      optionLabelFor = function(option){
        return option[field.opts.label]
      }

    if(_.isFunction(field.opts.label))
      optionLabelFor = function(option){
        return field.opts.label(option)
      }


    var options = _.map(remaining, function(e, idx){
      var label = optionLabelFor(e)
      return <option key={e.id} value={e.id}>{label}</option>
    }, this)

    return <div>
      <Chosen defaultValue={null} noResultsText="No result" width="300px" onChange={this.onChange} allowSingleDeselect={true}>
        <option></option>
        {options}
      </Chosen>
    </div>
  }
})

module.exports = PickAndAdd