var _ = require("underscore"),
    _i = require('underscore.inflections')

function defineArray({store, type, decorate, decorateCollection}){
  if(type !== type.toUpperCase())
    throw "type must be uppercase instead of " + type + "; attribute " + attribute

  var attribute = _i.camelize(type.toLowerCase(), false),
      attributeSingular = _i.singularize(attribute),
      attributePlural = _i.pluralize(attribute),
      attributeName = "_" + attributePlural,
      getSingular = "get" + _i.camelize(attributeSingular, true),
      getPlural = "get" + _i.camelize(attributePlural, true)


  if(attributeSingular == attributePlural)
    throw "singular == plural not supported; attribute: " + attribute

  if(store[attributeName])
    throw "attribute " + attributeName + " already exist"

  store[attributeName] = []

  store[getSingular] = function(id){
    if(id === null)
      return null

    return _.where(this[getPlural](), {id: parseInt(id, 10)})[0]
  }

  store[getSingular+"Any"] = function(){
    return this[getPlural]()[0]
  }

  store[getPlural] = function(ids){
    var entries =  this[attributeName]

    if(ids){
      var idsInt = _.map(ids, e => parseInt(e, 10))
      entries = _.map(idsInt, e => _.where(entries, {id: e})[0])
    }

    if(decorate)
      entries = _.map(entries, function(entry){
        return _.extend({}, entry, {ui: decorate.call(this, entry)})
      }, this)

    if(decorateCollection)
      entries = decorateCollection(entries)

    return entries
  }

}

module.exports = defineArray