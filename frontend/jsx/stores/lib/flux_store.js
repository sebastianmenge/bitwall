var EventEmitter = require('events').EventEmitter,
    _ = require("underscore"),
    _i = require('underscore.inflections'),
    Promise = require("bluebird"),
    req = require("./req.js"),
    {copy} = require("../../util.js"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    defineArray = require("./define_array.js"),
    RestRepo = require("./rest_repo.js")

var FluxStore = function(name){

  if(!name)
    throw "missing name argument"

  this._name = name

  this.emitChange = () => {
    this.emit("change")
    return Promise.resolve()
  }

  this.addChangeListener = function(callback) {
    this.on("change", callback)
  }

  this.removeChangeListener = function(callback) {
    this.removeListener("change", callback)
  }

  // this.fetch = function(url, ids, key){
  //   console.info(url, ids)

  //   var maxIds = 20
  //   var num = (ids.length / maxIds) + (ids.length % maxIds)

  //   return Promise.all(_.map(_.range(num), function(i){
  //     var subIds = ids.slice(i * maxIds, (i * maxIds) + maxIds)

  //     if(subIds.length == 0)
  //       return Promise.resolve([])

  //     return req("get", url + "/" + subIds.join(","), null, key)
  //   }, this)).then(_.flatten)
  // }

  this.dependsOn = function(stores){
    var allInitialized = _.all(stores, function(store){
      return store._initialized == true
    })

    if(!allInitialized)
      throw "found uninitialized dependency"
  }

  this.init = function(){
    if(this._initialized || this._initializing)
      return Promise.resolve()

    this._initializing = true

    document.body.classList.add("loading")

    return this.initialize.apply(this, arguments).bind(this).tap(function(){
      this._initialized = true
      this._initializing = false
    })
  }

  this.register = function(fun){
    if(this.dispatchToken)
      throw "found existing dispatchToken; invoke register() only once"

    this.dispatchToken = Dispatcher.register(payload => {
      if(!this._initialized)
        return

      var {action: {type: actionType, id: actionId, values: actionValues}} = payload

      var modCnt = 0

      _.each(this._collections, function({type: collectionType, links: collectionLinks}){
        var collectionAttribute = "_" + _i.pluralize(_i.camelize(collectionType.toLowerCase(), false)),
            collection = this[collectionAttribute]

        if(actionType == collectionType + "_CREATE"){

          this["_"+collectionType+"Repo"].createEntry(actionValues)
          .then(function(entry){
            Dispatcher.handleServerAction({type: collectionType+"_CREATED", id: entry.id, model: entry})
          })
          .then(function() {
            Dispatcher.handleViewAction({type: "PROCESSING_END"})
          })
          .catch(function(err) {
            Dispatcher.handleViewAction({type: "PROCESSING_ERROR"})
            Dispatcher.handleViewAction({type: "ALERT_ERROR", message: "Something went wrong!"})
          })

        }else if(actionType == collectionType + "_UPDATE"){
          var entry = _.where(collection, {id: actionId})[0],
              entryOrig = copy(entry)

          this["_"+collectionType+"Repo"].updateEntry(entry, actionValues)
          .then(function(entry){
            Dispatcher.handleServerAction({type: collectionType+"_UPDATED", id: entry.id, model: entry, prev: entryOrig})
          })
          .then(function(){
            Dispatcher.handleViewAction({type: "PROCESSING_END"})
          })
          .catch(function(err) {
            Dispatcher.handleViewAction({type: "PROCESSING_ERROR"})
            Dispatcher.handleViewAction({type: "ALERT_ERROR", message: "Something went wrong!"})
          })

        }else if(actionType == collectionType + "_DELETE"){
          var entry = _.where(collection, {id: actionId})[0]

          this["_"+collectionType+"Repo"]
          .removeEntry(entry)
          .then(function(){
            Dispatcher.handleServerAction({type: collectionType+"_DELETED", id: entry.id, model: entry})
          })
        }else if(actionType == collectionType+"_CREATED"){
          collection.push(payload.action.model)
          modCnt++
        }else if(actionType == collectionType+"_UPDATED"){
          modCnt++

          var modelLinks = payload.action.model.links,
              prevLinks = (payload.action.prev||{}).links||{}

          var anyLinkChanged = _.any(modelLinks, function(val, key){
            return !_.isEqual(modelLinks[key], prevLinks[key])
          }, this)

          // learn unit media files can be change on server so we have to force a reload
          if (payload.action.model.type == 'LearnUnit') anyLinkChanged = true;

          if(anyLinkChanged)
            setTimeout(function(){
              Dispatcher.handleServerAction({type: collectionType+"_LINKS_CHANGED", id: actionId, model: payload.action.model, prev: prevLinks})
            }, 0)

        }else if(actionType == collectionType+"_DELETED"){
          this[collectionAttribute] = _.without(collection, _.where(collection, {id: actionId})[0])
          modCnt++
        }




        // ++++++++++++
        // links
        // ++++++++++++

        _.each(collectionLinks, function({cardinality, type: linkType, isOwner}, link){

          if(actionType == linkType + "_CREATED"){
            var linkedEntryId = payload.action.model.links[_i.camelize(collectionType.toLowerCase(), false)]
            _.each(collection, function(entry){
              if (entry.id!==linkedEntryId)return
              if(cardinality == "many" && isOwner){
                console.info("received "+actionType+"; add actionId("+actionId+") to entry.links["+link+"]")
                entry.links[link].push(actionId)
                modCnt++
              }else if(cardinality == "one" && isOwner){
                console.info("received "+actionType+"; set actionId("+actionId+") on "+collectionAttribute+".links."+link+"; previous value: "+entry.links[link])
                entry.links[link] = actionId
                modCnt++
              }
            }, this)

          }else if(actionType == linkType + "_UPDATED"){
            // modCnt++

            // var modelLinks = payload.action.model.links,
            //     prevLinks = (payload.action.prev||{}).links||{}

            // var anyLinkChanged = _.any(modelLinks, function(val, key){
            //   return !_.isEqual(modelLinks[key], prevLinks[key])
            // }, this)

            // if(anyLinkChanged)
            //   setTimeout(function(){
            //     Dispatcher.handleServerAction({type: linkType+"_LINKS_CHANGED", id: actionId, model: payload.action.model, prev: prevLinks})
            //   }, 0)

          }else if(actionType == linkType + "_DELETED"){
            _.each(collection, function(entry){
              if(cardinality == "many"){
                if(_.include(entry.links[link], actionId)){
                  console.info("received "+actionType+"; remove actionId("+actionId+") from "+collectionAttribute+".links."+link)
                  entry.links[link] = _.without(entry.links[link], actionId)
                  this.emitChange()
                  modCnt++
                }
              }else if(cardinality == "one"){
                if(entry.links[link] == actionId){
                  console.info("received "+actionType+"; set actionId("+actionId+") to null on "+collectionAttribute+".links."+link)
                  entry.links[link] = null
                  modCnt++
                }
              }
            }, this)
          }

        }, this)

      }, this)

      if(modCnt)
        this.emitChange()


      fun.call(this, payload)
    })
  }

  this._collections = []
  this.defineCollection = function(collection){
    this._collections.push(collection)
    var {type, decorate, decorateCollection, links, url} = collection
    defineArray({store: this, type, decorate, decorateCollection})

    if(!url)
      url = "/ebe-api/" + _i.pluralize(type.toLowerCase())

    var key = _i.camelize(_.last(url.split("/")), false)

    return this["_"+type+"Repo"] = RestRepo.create(url, key)
  }
}

_.extend(FluxStore.prototype, EventEmitter.prototype)

module.exports = FluxStore
