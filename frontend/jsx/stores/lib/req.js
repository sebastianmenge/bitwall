var request = require("superagent"),
    Promise = require("bluebird"),
    _ = require("underscore"),
    {underscored,camelize,getCookie} = require("../../util.js")


var transformRequest = function(req){
  if(req === null)
    return null

  return underscored(req)
}

var transformResponse = function(res){
  if(res === null)
    return null

  return camelize(res)
}


var req = function(method, url, data, extractKey){
  method = method.toLowerCase()

  if(method == "delete")
    method = "del"

  var r = request[method.toLowerCase()](url.indexOf("://") == -1 ? ("https://"+API_HOST+url) : url)

  r.type("application/json")

  if(data) r.send(transformRequest(data));
  if(data && method=="get") r.query(transformRequest(data));


  r.set("X-Edu-Token", EDUCATOR_TOKEN)
  r.set("X-Auth-Token", decodeURIComponent(getCookie("admin_auth_token")))

  return new Promise(function(resolve, reject){
    r.end(function(res){
      if(res.ok){
        resolve(method == "del" ? true : extractKey ? transformResponse(res.body)[extractKey] : transformResponse(res.body))
      }else{
        reject(Error(method + ":" + url + " failed: "+ ((res.error && res.error.message) || res.text)))
      }
    })
  })
}

module.exports = req