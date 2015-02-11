var React = require("react"),
    Link = require("react-router").Link,
    _ = require("underscore")

var TileList = React.createClass({

  propTypes: {
    entries: React.PropTypes.array.isRequired,
    numColumns: React.PropTypes.number.isRequired
  },

  render: function(){
    var {entries, numColumns} = this.props

    var entryElements = _.map(_.toArray(_.groupBy(entries, (element, index) =>Math.floor(index/numColumns))), function(e, idx){
      var items = []

      for(var i=0; i < numColumns; i++){
        if(e[i]){
          var iconClass;
          if (e[i].icon && e[i].icon.match(/^pa-icon/)) {
            iconClass = "pa-icon " + e[i].icon+"-blue"
          } else {
            iconClass = "fa icon-big " + e[i].icon;
          }
          var item = <div className={"col-xs-"+(12 / numColumns)}>
            <div className="form-type">
              <Link to={e[i].route} className="tileList-icon-container"><i className={iconClass}></i></Link>
              <p dangerouslySetInnerHTML={{__html: e[i].description}}/>

              <Link to={e[i].route} className="btn btn-primary-action btn-block">{e[i].label}</Link>
            </div>
          </div>

          items.push(item)
        }else{
          items.push(null)
        }
      }

      return <div key={idx} className="row">
        {items}
      </div>
    }, this)

    return <div>
      <div className="form-type-chooser">
        {entryElements}
      </div>
    </div>
  }
})

module.exports = TileList