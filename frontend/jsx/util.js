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

var createApp = function(fun){
  return React.createClass({
    statics: {
      willTransitionTo: function(){
        return fun()
      }
    },
    render: function(){
      return this.props.activeRouteHandler({educator: this.props.educator})
    }
  })
}

function findImageUrl(mediaFile, fallback){
  if (!mediaFile) return fallback||null;
  var names = ['image', 'videoPreview', 'imageMedium', 'squareImageMedium','logo','favicon']
  return (_.chain(names)
            .map(function(name){
              return mediaFile.data && mediaFile.data[name];
            }).compact().first().value() || {url:mediaFile.url||fallback||null}
          ).url;
}

var currToSymbol = {"EUR":"€", "USD": "$", "GBP": "£"};

function formatMoney(amount, currency){
  var symbol = currToSymbol[currency] || currency;
  var format = "$ 0,0[.]00";
  return numeral(amount*0.01).format(format).replace("$",symbol);
}

function formatDate(date){
  return moment(date).format('L')
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}

function download(filename, filetype, content) {
  var link = document.createElement("a"),
      blob = new Blob([content], { type: "text/"+filetype+";charset=utf-8;" });

  if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style = "visibility:hidden";
  } else if (navigator.msSaveBlob) { // IE 10+
     link.addEventListener("click", function (event) {
     navigator.msSaveBlob(blob, filename);
    }, false);
  } else {
    alert("sorry, your Browser does not handle Patience's direct download handling. Please use at least Internet Explorer 10, or preferably Firefox or Chrome.")
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

var expandAuthCookie = _.throttle (function(minutes) {
  var token = cookies.get("admin_auth_token");
  if (!token)
  {
    url = 'http://www.patience.io';
    host = window.location.href;
    if (host && host.indexOf('.pre.') > 0) url = 'http://www.pre.patience.io';
    window.location.href = url + '/login?lomsg=true&next_path=' + window.location.pathname;
  } else {
    cookies.set("admin_auth_token", token, {
      domain: ".patience.io",
      expires: moment().add(minutes || 60, 'minute').toDate()
    });
  }
}, 10000);

module.exports = {copy, createApp, findImageUrl, underscored, camelize, formatMoney, formatDate, getCookie, download, expandAuthCookie}

