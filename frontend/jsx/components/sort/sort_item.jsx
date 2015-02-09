var React = require("react"),
    SortMixin = require("./sort_mixin.js"),
    SortContainer = require("./sort_container.jsx");

function isBelow(node, event) {
  return (event.clientY - (node.getBoundingClientRect().top)) > (node.offsetHeight / 2);
}

module.exports = React.createClass({

  mixins: [SortMixin],

  getDefaultProps: function() {
    return {
      domType: 'div'
    };
  },

  dragStart: function(e) {
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/html', null);
    } catch (ex) {
      e.dataTransfer.setData('text', '');
    }

    var dragStartEvent = new CustomEvent("pa-drag-started",{
        detail:{
          id:this.props.id
        },
        bubbles: true
      });
    this.getDOMNode().dispatchEvent(dragStartEvent);

  },

  dragOver: function(e) {
    var over = e.currentTarget;
    if (over!==this.getDOMNode()) throw "don't know what to do, 'over' is not me!?"

    var dragOverEvent = new CustomEvent("pa-drag-over",{
        detail:{
          id:this.props.id,
          isBelow:isBelow(over, e)
        },
        bubbles: true
      });
    over.dispatchEvent(dragOverEvent);

    e.preventDefault();
  },

  dragEnd: function(e) {
    this.getDOMNode().dispatchEvent(new CustomEvent("pa-drag-finished",{bubbles:true}));
    e.preventDefault();
  },

  render: function(){
    return this.renderDomType({
      className: this.props.itemClassName||"",
      draggable: true,
      onDragStart: this.dragStart,
      onDragOver: this.dragOver,
      onDragEnter: this.dragOver,
      onDragEnd: this.dragEnd
    }, this.props.children);
  }
})