var Promise = require('bluebird'),
    _ = require('underscore')

var Validator = {
  required: function(){
    return function(v){
      return v || v === 0 ? Promise.resolve() : Promise.reject("This field is required")
    }
  },
  minLength: function(minLength){
    return function(v){
      if(v === null) return Promise.resolve()
      return (v.length >= minLength) ? Promise.resolve() : Promise.reject("Too short (min. "+minLength+")")
    }
  },
  maxLength: function(maxLength){
    var f = function(v){
      if(v === null) return Promise.resolve()
      return v.length <= maxLength ? Promise.resolve() : Promise.reject("Too long (max. "+maxLength+")")
    }
    f.maxLength = maxLength

    return f
  },
  minValue: function(minValue){
    return function(v){
      if(v === null) return Promise.resolve()
      return (v >= minValue) ? Promise.resolve() : Promise.reject("Too small (min. "+minValue+")")
    }
  },
  maxValue: function(maxValue){
    return function(v){
      if(v === null) return Promise.resolve()
      return (v <= maxValue) ? Promise.resolve() : Promise.reject("Too big (max. "+maxValue+")")
    }
  },
  regex: function(pattern){
    return function(v){
      if(v === null) return Promise.resolve()
      return v.toString().match(pattern) ? Promise.resolve() : Promise.reject("Invalid format")
    }
  },
  confirm: function(field){
    return function(v, validValues){
      if(v === null) return Promise.resolve()
      return v === validValues[field] ? Promise.resolve() : Promise.reject("Doesn't match")
    }
  },
  uniqueEmail: function(){
    return function(v){
      if(v === null) return Promise.resolve()
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          if(v === null) resolve()

          if(v !== "jan"){
            resolve()
          }else{
            reject("The email is not unique")
          }
        }, 1000)
      })
    }
  },
  uniqueFromList: function(allEntries){
    return function(v){
      if(v === null) return Promise.resolve()
      return new Promise(function(resolve, reject){
        if(_.contains(allEntries, v)){
          reject("Value is already used")
        }else{
          resolve()
        }
      })
    }
  }
}

module.exports = Validator;