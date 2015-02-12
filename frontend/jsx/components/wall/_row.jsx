var React = require("react"),
    _ = require("underscore"),
    createHSLs = require("../../util.js").createHSLs,
    Note = require("../note/_note.jsx");

var Row = React.createClass({
  displayName: "Row",

  propTypes: {
    notes: React.PropTypes.array.isRequired,
    rowNumber: React.PropTypes.number.isRequired,
  },

  render: function() {
    var {rowNumber, notes} = this.props,
        notesByRow = _.sortBy(notes, function(note){ return note.row; });
        rowNumberClass = "row-"+rowNumber,
        hslColors = createHSLs(3);
    console.log("hslColors", hslColors);
    var notes = _.map(notesByRow, function(note, idx) {
      var note = (rowNumber === note.row) ? <Note color={hslColors[idx]} data={note} key={note.id}/> : null
      return note
    })

    return <div className={'row '+rowNumberClass}>
      {notes}
    </div>
  }

})

module.exports = Row;
