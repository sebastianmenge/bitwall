var React = require("react"),
    SortItem = require("./sort_item.jsx"),
    SortMixin = require("./sort_mixin.js"),
    cloneWithProps = require("react/addons").addons.cloneWithProps,
    merge = require("react/lib/merge"),
    _ = require("underscore");

var containerDomElToChildDomEl = {
  "ul":"li",
  "ol":"li",
  "table":"tr",
  "tbody":"tr",
  "thead":"tr",
  "tfoot":"tr"
};

var defaultHelperOpts = {
  idProp: "id",
  inlineSorting: false
}

var getIndex = function(array, id, idProp) {
  var itemInArray = null;
  if (_.isFunction(idProp)) {
    itemInArray = _.find(array, function(item) {return idProp(item,id);});
  } else {
    itemInArray = _.find(array, function(item) {return item[idProp]==id;});
  }
  if (!itemInArray) throw "COULD NOT FIND ITEM WITH id `"+id+"` in array: "+JSON.stringify(array);
  return _.indexOf(array, itemInArray);
}

var addSortArrayHelper = function(res) {
  res.sortArray = function(array,opts) {
    opts = merge(defaultHelperOpts, opts);
    if (!opts.inlineSorting) array = _.clone(array);

    var fromIndex = getIndex(array, res.id, opts.idProp);

    var toIndex = res.below ?
      getIndex(array, res.below, opts.idProp) :
      getIndex(array, res.above, opts.idProp) - 1;
    toIndex += (fromIndex > toIndex ? 1 : 0);
    array.splice(toIndex,0, array.splice(fromIndex,1)[0]);

    return array;
  };
};

var SortContainer = module.exports  = React.createClass({

  mixins: [SortMixin],

  propTypes: {
    domType: function(props, propName, componentName) {
      var value = props[propName];
      if (value && React.DOM[value]===undefined) {
        // doesn't seem to have any effect!?
        return new Error('domType needs to be a string describing a React DOM element!');
      }
    },
    onDragEnd: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      domType: 'ul'
    };
  },

  getInitialState: function() {
    return {draggedOver: null}
  },

  componentDidMount: function () {
    this.getDOMNode().addEventListener("pa-drag-started", this.dragStart);
    this.getDOMNode().addEventListener("pa-drag-finished", this.dragEnd);
    this.getDOMNode().addEventListener("pa-drag-over", this.dragOver);
  },

  componentWillUnmount: function() {
    // TODO: remove listeners
  },

  dragStart: function({detail: {id}}) {
    this.setState({dragging: id});
  },

  dragOver: function({detail: {id, isBelow}}) {
    this.setState({draggedOver: {id, isBelow}});
  },

  dragEnd: function() {
    if (this.props.onDragEnd) {
      var res = {
        id: this.state.dragging,
        below: this.state.draggedOver.isBelow ? this.state.draggedOver.id : null,
        above: !this.state.draggedOver.isBelow ? this.state.draggedOver.id : null
      };
      addSortArrayHelper(res);
      this.props.onDragEnd(res);
    }
    this.setState({dragging:null, draggedOver: null});
  },

  render: function(){
    var children = React.Children.map(this.props.children, function(child) {
      if (child.type === SortItem.type) {
        return cloneWithProps(child,{
          key: child.props.key,
          domType: child.props.domType || containerDomElToChildDomEl[this.props.domType]
        });
      } else {
        return child;
      }
    }, this)
    return this.renderDomType(null,children);
  }
})

/*
SAMPLE IMPLEMENTATION:

var React = require("react"),
    SortContainer = require("../components/sort/sort_container.jsx"),
    SortItem = require("../components/sort/sort_item.jsx"),
    _ = require("underscore");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      items:["0 Red","1 Orange","2 Blue","3 Yellow"]
    }
  },
  dragEnd: function(res) {
    var resortedItems = res.sortArray(items,{idProp: function(item, id){return item===id;}})
    this.setState({items: resortedItems});
  },
  render: function(){
    var items = this.state.items.map(function(item) {
      return <SortItem key={item} id={item}><td><b>{item}</b></td></SortItem>;
    });
    return (
      <table>
        <SortContainer onDragEnd={this.dragEnd} domType="tbody">
          {items}
        </SortContainer>
      </table>
      );
  }
})
*/