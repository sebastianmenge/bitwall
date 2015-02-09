var _ = require("underscore"),
    req = require("./req.js"),
    Promise = require("bluebird"),
    request = require("superagent")

var RestRepo = function(url, key){
  this._entries = {}
  this._defers = {}
  this.url = url
  this.key = key
}

_.extend(RestRepo.prototype, {
  memberAction: function(method, action, id, data){
    return req(method, this.url + "/" + id + "/actions/" + action, data, this.key).bind(this).then(function(){
      return this.reload(id)
    })
  },
  createEntry: function(values){
    return req("post", this.url, values, this.key).bind(this).then(function(entries){
      var entry = entries[0]

      this._defers[entry.id] = Promise.defer()
      this._defers[entry.id].resolve(entry)

      return this._entries[entry.id] = this._defers[entry.id].promise
    })
  },
  removeEntry: function(entry){
    return req("delete", this.url + "/" + entry.id, {}, this.key).bind(this).then(function(){
      delete this._entries[entry.id]
      return entry
    })
  },
  updateEntry: function(entry, values){
    return req("put", this.url+"/"+entry.id, values, this.key).bind(this).then(function(entries){
      return this._entries[entry.id].tap(function(val){
        _.extend(val, entries[0])
      })
    })
  },
  fetch: function(ids){
    var maxIds = ids.length > 250 ? 250 : ids.length
    var num = (ids.length / maxIds) + (ids.length % maxIds)

    return Promise.all(_.map(_.range(num), function(i){
      var subIds = ids.slice(i * maxIds, (i * maxIds) + maxIds)

      if(subIds.length == 0)
        return Promise.resolve([])

      return req("get", this.url + "/" + subIds.join(","), null, this.key)
    }, this)).then(_.flatten)

    // return req("get", this.url + "/" + ids.join(","), null, this.key)
  },
  getEntry: function(id){
    if(id === null || id === undefined)
      return Promise.resolve(null)

    return this.getEntries([id]).any()
  },
  reloadAll: function(){
    var ids = _.map(_.keys(this._defers), function(id){
      return parseInt(id, 10)
    })
    return this.reload(ids)
  },
  reload: function(id){
    if(!id)
      id = []

    var id = _.isArray(id) ? id : [id]
    return this.fetch(id).bind(this).each(function(entry){

      var existingPromise = this._entries[entry.id]

      if(existingPromise){

        if(existingPromise.isFulfilled()){
          // already fulfilled

          var existingValue = existingPromise.value()
          _.extend(existingValue, entry)

          return existingPromise
        }else{
          // reject before any pending request resolves
          existingPromise.reject()

          // requested before, but not loaded yet
          this._defers[entry.id] = Promise.defer()
          this._defers[entry.id].resolve(entry)
          return this._entries[entry.id] = this._defers[entry.id].promise
        }

      }else{
        // not loaded before
        this._defers[entry.id] = Promise.defer()
        this._defers[entry.id].resolve(entry)
        return this._entries[entry.id] = this._defers[entry.id].promise
      }


    })

    // return this.fetch([id]).bind(this).any().tap(function(entry){
    //   this._defers[id] = Promise.defer()
    //   this._defers[id].resolve(entry)
    //   this._entries[id] = this._defers[id].promise
    // })
  },
  getEntries: function(ids){
    if(!ids)
      return Promise.reject("missing ids arguments")

    if(!ids.length)
      return Promise.resolve([])

    var nonExistingIds = _.select(ids, function(id){
      if(id === null || id === undefined)
        throw "found NULL in ids"

      return !this._entries[id]
    }, this)

    _.each(nonExistingIds, function(id){
      var defer = this._defers[id] ? this._defers[id] : (this._defers[id] = Promise.defer())
      this._entries[id] = defer.promise
    }, this)

    if(nonExistingIds.length){
      var allIds = _.reduce(nonExistingIds,(m,id)=> {m[id]=true;return m;},{});
      this.fetch(nonExistingIds).bind(this).each(function(entry){
        this._defers[entry.id].resolve(entry)
        delete allIds[entry.id];
      }).then(function() {
        _.each(allIds, (id)=>{this._defers[id].reject("not_found");});
      })
    }

    return Promise.all(_.map(ids, function(id){
      return this._entries[id]
    }, this))

  }
})

module.exports = {
  create: function(url, key){
    var rr = new RestRepo(url, key)
    _.bindAll.apply(_, [rr].concat(_.functions(rr)))
    return rr
  }
}