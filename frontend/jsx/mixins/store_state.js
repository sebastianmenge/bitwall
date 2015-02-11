var _ = require("underscore")

var StoreState = function(){

  var stores = _.map(arguments, function(store){ return store })

  if(stores.length === 0)
    throw "pass at least one store or do not mixin StoreState"

  return {
    onStoreChange: function(){
      if(this.isMounted())
        this.setState(this.getStoreState())
    },
    componentWillMount: function(){
      if(!this.getStoreState)
        throw "missing method getStoreState"

      _.invoke(stores, "addChangeListener", this.onStoreChange)
    },
    componentWillUnmount: function(){
      _.invoke(stores, "removeChangeListener", this.onStoreChange)
    },
    getInitialState: function(){
      return this.getStoreState()
    }
  }
}

module.exports = StoreState
