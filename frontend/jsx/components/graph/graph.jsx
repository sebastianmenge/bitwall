var React = require("react"),
    Chart = require("chart.js/Chart");


// Monkey-Patch chart.js due to issue: https://github.com/nnnick/Chart.js/issues/434

var Type, cancelAnimFrame, name, _ref;
cancelAnimFrame = (function() {
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(callback) {
    return window.clearTimeout(callback, 1000 / 60);
  };
})();

_ref = Chart.types;
for (name in _ref) {
  Type = _ref[name];
  Type.prototype.stop = function() {
    return cancelAnimFrame(this.animationFrame);
  };
}

var cols = ["79,131,227","126,227,79","170,79,227"]

function createBaseDataset(index, label) {
  var col = cols[index%cols.length];
  return {
    label,
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba("+col+",1)",
    fillColor: "rgba("+col+",0.2)",
    strokeColor: "rgba("+col+",0.1)",
    pointColor: "rgba("+col+",1)",
    data: []
  };
}

var Graph = module.exports = React.createClass({
  displayName: "Graph",


  propTypes: {
    // function: React.PropTypes.func.isRequired,
    height: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      height: 400
    };
  },

  _drawChart: function() {
    if (!this.props.data.length) {
      console.warn("warning: no data passed to graph");
      return;
    }
    var labels = _.pluck(this.props.data,"label"),
        datasets = _.map((this.props.data[0]).values, (v,i) => createBaseDataset(i, this.props.labels && this.props.labels[i]));

    _.each(this.props.data, d => {_.each(d.values, (v, i) => {datasets[i].data.push(v)})});

    var opts = {
      bezierCurveTension: 0.2,
      responsive: true,
      maintainAspectRatio: false,
      tooltipTemplate: this.props.tooltipTemplate,
      multiTooltipTemplate: "<%= value %> <%= datasetLabel %>",
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span> bla<%if(){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };
    this._chart.Line({labels, datasets},opts)
  },

  componentDidMount: function() {
    this._chart = new Chart(this.refs.canvas.getDOMNode().getContext("2d"));
    this._drawChart();
  },

  componentWillUnmount: function() {

  },

  render: function() {
    return <div style={{height:this.props.height, maxWidth:900}} className="graph-container"><canvas ref="canvas"></canvas></div>;
  }

})