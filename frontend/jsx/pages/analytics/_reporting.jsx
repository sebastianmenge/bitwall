var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context"),
    Graph = require("../../components/graph/graph.jsx"),
    req = require("../../stores/lib/req"),
    moment = require("moment"),
    numeral = require("numeral"),
    DateInput = require("../../components/date_input/date_input.jsx"),
    Store = require("../../stores/flux/store"),
    AppCfg = require("../../app_config.js"),
    Button = require('react-bootstrap/Button'),
    {download} = require("../../util.js");

var rowLabelSortIndex = {"startDate":1}
function convertToCsvValue(val){
  if (_.isDate(val)) return moment(val).format("YYYY-MM-DD");
  return val;
}

var CsvDownloadButton = React.createClass({
  displayName: "CsvDownloadButton",

  getInitialState: function() {
    return {loading: false};
  },

  _handleClick: function() {
    this.setState({loading:true});
    var labels = _.extend({startDate:"date"},this.props.labels||{}),
        queryParams = {
          startDate: this.props.startDate.format(),
          endDate: this.props.endDate.clone().add(1,'day').format(),
          intervalUnit: 'day',
          intervalSteps: 1,
        };
    req("get","/ebe-api2/stats/"+this.props.type,queryParams).then(res => {
      if (res.length) {
        var keys = _.sortBy(_.reject(_.keys(res[0]),k=>k==="endDate"), k => k==="startDate" ? 1 : 2),
            content = _.map(res, row => _.map(keys, k => convertToCsvValue(row[k])).join(",")),
            headers = _.map(keys, key=>labels[key]||key).join(",");

        var fileName = "patience-report-"+(this.props.filePrefix||this.props.type)+"-"+this.props.startDate.format("YYYYMMDD")+"-"+this.props.endDate.format("YYYYMMDD")+ ".csv";
        download(fileName, 'csv', [headers].concat(content).join("\n"));
      }
      this.setState({loading: false});
    });
  },

  render: function() {
    return <Button bsStyle="default" bsSize="small" onClick={this._handleClick} disabled={this.state.loading}>
      download as csv
    </Button>;
  }

});

module.exports = React.createClass({

  mixins: [PageContext],

  statics: {
    willTransitionTo: function(transition, params){
      if(!Store.Educator.hasActiveApp("preporting"))
        transition.redirect(AppCfg.getByName("preporting").route)
    }
  },

  getInitialState: function() {
    var startDate = moment.max(
          moment.min(moment().subtract(1,'day'),moment(this.props.educator.createdAt)),
          moment().startOf('day').subtract(10, 'week').add(1,'day')
        ),
        endDate = moment().startOf('day');

    return _.extend({
        revenueData:null,
        ordersData:null,
        leadsData:null,
      },
      this.getDateState({startDate, endDate})
    );
  },

  getDateState: function({startDate, endDate}) {
    startDate = startDate || this.state.startDate;
    endDate = endDate || this.state.endDate;
    var intervalUnit, intervalSteps=1,
        diff = endDate.diff(startDate, 'month', true);
    if (diff > 12) intervalUnit='month';
    else if (diff > 6) {intervalUnit='week';intervalSteps=2;}
    else if (diff > 1) intervalUnit='week';
    else intervalUnit='day';
    return {startDate, endDate, intervalUnit, intervalSteps};
  },

  componentWillMount: function () {
    this._updateStats();
  },

  _updateStats: function() {
    this.setState({revenueData:null, ordersData:null, leadsData: null});
    this._fetchData("revenue",point => [Math.round(point.revenue*0.01)]);
    this._fetchData("orders",point => [point.free, point.trials, point.paid]);
    this._fetchData("leads",point => [point.leads, point.signups]);
  },

  _fetchData: function(type,transformValuesFn) {
    var queryParams = {
      startDate: this.state.startDate.format(),
      endDate: this.state.endDate.clone().add(1,'day').format(),
      intervalUnit: this.state.intervalUnit,
      intervalSteps: this.state.intervalSteps,
    }
    req("get","/ebe-api2/stats/"+type,queryParams).then(res => {
      var points = [];
      _.each(res, point => {
        var start = moment(point.startDate), end = moment(point.endDate).subtract(1,'second');
        var label = start.format("DD MMM");
        if (!start.startOf('day').isSame(end.startOf('day'))) label += " - " + end.format("DD MMM");
        points.push({label: label, values: transformValuesFn(point)})
      })
      var newState = {};
      newState[type+"Data"] = points;
      this.setState(newState);
    });
  },

  _handleStartDateChange: function(date) {
    this.setState(this.getDateState({startDate: moment(date).startOf('day')}), this._updateStats);
  },

  _handleEndDateChange: function(date) {
    this.setState(this.getDateState({endDate: moment(date).startOf('day')}), this._updateStats);
  },

  render: function(){
    return (
      <div>
        <form className="pull-right form-inline reportingPage-timeselect-form">
          <label>From: </label>
          <DateInput
            value={this.state.startDate.toDate()}
            hideRemove={true}
            maxDate={this.state.endDate.clone().subtract(1,'day').toDate()}
            onChange={this._handleStartDateChange}
            />
          <label>Until: </label>
          <DateInput
            value={this.state.endDate.toDate()}
            hideRemove={true}
            maxDate={moment().toDate()}
            minDate={this.state.startDate.clone().add(1,'day').toDate()}
            onChange={this._handleEndDateChange}
            />
        </form>
        <h1>Reporting</h1>

        <div className="pull-right"><CsvDownloadButton type="revenue" filePrefix="gross-revenue" labels={{revenue:"revenueInCents"}} startDate={this.state.startDate} endDate={this.state.endDate}/></div>
        <h2>Gross Revenue</h2>
        {this.state.revenueData ? <Graph data={this.state.revenueData} tooltipTemplate={"<%=label%>: <%=value%> "+this.props.educator.defaultCurrency}/> : "loading..."}

        <div className="pull-right"><CsvDownloadButton type="orders" filePrefix="enrollments" startDate={this.state.startDate} endDate={this.state.endDate}/></div>
        <h2>Enrollments (free, trial, paid)</h2>
        {this.state.ordersData ? <Graph data={this.state.ordersData} labels={["Free","Trials","Paid"]}/> : "loading..."}

        <div className="pull-right"><CsvDownloadButton type="leads" filePrefix="signups-and-leads" startDate={this.state.startDate} endDate={this.state.endDate}/></div>
        <h2>Signups and Leads</h2>
        {this.state.leadsData ? <Graph data={this.state.leadsData} labels={["Leads","Signups"]}/> : "loading..."}
      </div>
    );
  }
})
