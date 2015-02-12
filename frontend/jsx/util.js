var _ = require("underscore"),
    _s = require("underscore.string"),
    moment = require("moment"),
    React = require("React"),
    numeral = require("numeral"),
    cookies = require("cookies-js");

var parseDates = function (data) {
  var iso8601 = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;
  _.each(data, function (value, key) {
    if(_.isString(value) && iso8601.test(value)) {
      data[key] = new Date(value);
    }
  });
  return data
};

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

// ------------------- Note border colors -----------------------

var arrRepeat = function(arr, times) {
  var repeated = [],
      times = parseInt(times) || 1;
  for (var i = 0; i < times; i++) {
    repeated = repeated.concat(arr);
  };
  return _.flatten(repeated);
}

var createHSLs = function(repeater) {
  var colors = [],
      hues = [7, 24, 32, 45, 57, 67, 76, 93, 130, 152, 183, 196, 212],
      shades = 1;

  for (var i = 0; i < hues.length; i++) {
    var hue = hues[i],
        lightness = 46;

    for (var j = 0; j < shades; j++) {
      lightness -= 4;
      hsl = 'hsl(' + hue + ', 100%, ' + lightness + '%)';
      colors.push(hsl);
    }
  };
  return arrRepeat(colors, repeater);
}



module.exports = {copy, underscored, camelize, createHSLs}

