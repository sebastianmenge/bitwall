var _ = require("underscore"),
    _s = require("underscore.string"),
    moment = require("moment"),
    React = require("React"),
    numeral = require("numeral"),
    cookies = require("cookies-js");

var toCamel = function(str){
  return str.replace(/\w(\_[a-z0-9])/g, function($1){return $1[0]+$1[2].toUpperCase();});
};

var camelize = function(obj, inPlace){
  if(!inPlace)
    obj = copy(obj)

  if(_.isArray(obj)){
    _.each(obj, function(e, idx){
      obj[idx] = camelize(e, true)
    })
  }else if(_.isObject(obj)){
    _.each(obj, function(val, key){
      delete obj[key]
      obj[toCamel(key)] = camelize(val, true)
    })
    obj = parseDates(obj)
  }

  return obj
}

var toUnderscore = function(str){
  return str.replace(/([A-Z]|[0-9]+)/g, function($1){return "_"+$1.toLowerCase();});
};

var underscored = function(obj, inPlace){
  if(!inPlace)
    obj = copy(obj)

  if(_.isArray(obj)){
    _.each(obj, function(e, idx){
      obj[idx] = underscored(e, true)
    })
  }else if(_.isObject(obj)){
    _.each(obj, function(val, key){
      delete obj[key]
      obj[toUnderscore(key)] = underscored(val, true)
    })
  }

  return obj
}


// ------------

var copyObj = function(obj){
  if(obj === null)
    return null

  return _.inject(obj, function(memo, val, key){
    memo[key] = _.isFunction(val) ? val : copy(val)
    return memo
  }, {})
}

var copyArr = function(arr){
  if(arr === null)
    return null

  return _.inject(arr, function(memo, e){
    memo.push(copy(e))
    return memo
  }, [])
}

var copy = function(any){
  if(_.isArray(any))
    return copyArr(any)

  if(_.isObject(any))
    return copyObj(any)

  return any
}

module.exports = {copy, underscored, camelize}

