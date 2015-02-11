var React = require("react"),
    _ = require("underscore"),
    cx = require('react/addons').addons.classSet,
    {copy,formatMoney,formatDate, download} = require("../util.js"),
    SortContainer = require("./sort/sort_container.jsx"),
    SortItem = require("./sort/sort_item.jsx"),
    Dispatcher = require("../dispatchers/patience_dispatcher.js"),
    Store = require("../stores/flux/store.js"),
    AppCfg = require("../app_config.js"),
    Router = require('react-router'),
    Moment = require("moment"),
    Button = require('react-bootstrap/Button')

var CsvDownloadBox = React.createClass({
  onClick: function(){
    if(Store.Educator.hasActiveApp("csvdownload"))
      return this.props.onClick()

    Router.transitionTo(AppCfg.getByName("csvdownload").route)
    return false
  },

  render: function() {
    return <Button bsStyle="default" bsSize="small" onClick={this.onClick}>
      Export full .csv list
    </Button>
  }
})

var NumResultsPerPageChooser = React.createClass({
  onChange: function(e){
    this.props.onChange(parseInt(e.target.value, 10))
  },
  render: function(){
    return <div className="list-view-action">
      <span>Results per page</span>&nbsp;
      <select className="form-control" name="results" onChange={this.onChange}>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  }
})

var SearchBox = React.createClass({
  getInitialState: function(){
    return {search: ""}
  },
  onChange: function(e){
    var search = e.target.value
    this.setState({search: search})
    this.props.onChange(search)
  },
  onSubmit: function(){
    return false
  },
  render: function(){
    return <div className="list-view-action list-view-action-expand">
      <div className="input-group">
        <span className="input-group-addon"><i className="fa fa-search"></i></span>
        <input type="text" className="form-control form-control-counter" id="course_title" name="course_title" placeholder={this.props.filterLabel} value={this.state.search} onChange={this.onChange}/>
      </div>
    </div>
  }
})

var QuickActions = React.createClass({
  render: function(){
    return <div className="list-view-action">
      <select className="form-control" name="actions">
        <option value="" disabled selected>Quick Actions</option>
        <option value="1">Somewhat</option>
      </select>
    </div>
  }
})

var Pagination = React.createClass({
  onClickPage: function(page, e){
    e.preventDefault()
    this.props.onClickPage(page)
  },
  render: function(){
    var numPerPage = this.props.numPerPage,
        page = this.props.page,
        numTotal = this.props.numTotal,
        numPages = Math.floor(numTotal / numPerPage) + (numTotal % numPerPage > 0 ? 1 : 0)

    var items = _.map(_.range(numPages), function(e){
      var className = (e == page) ? "active" : ""
      return <li key={e} className={className}><a onClick={this.onClickPage.bind(this, e)}>{e+1}</a></li>
    }, this)

    var nextPage = _.bind(function(e){
      if(page < numPages - 1)
        this.onClickPage(page + 1, e)
    }, this)

    var prevPage = _.bind(function(e){
      if(page > 0)
        this.onClickPage(page - 1, e)
    }, this)

    return <div className="clearfix">
      <ul className="pagination pull-right">
        <li><a onClick={prevPage}><i className="fa fa-caret-left"></i></a></li>
        {items}
        <li><a onClick={nextPage}><i className="fa fa-caret-right"></i></a></li>
      </ul>
    </div>
  }
})

var TableRowHeader = React.createClass({

  setSorter: function(attribute){
    this.props.setSorter(function(e){
      var val = _.isFunction(attribute) ? attribute(e) : e[attribute]
      if(_.isString(val))
        return val.toLowerCase()

      if(val === null || val === undefined)
        return ""

      return val
    })

    this.props.toggleSorterOrder()
  },

  render: function(){

    var tableDescriptor = this.props.tableDescriptor,
        cells = copy(tableDescriptor.cells);
    if (tableDescriptor.sortable) {
      cells.unshift({label: '', type: Type.text(e => e)})
    }
    var items = _.map(cells, function(c, idx){
          var className = cx({choose: c.type == "choose"})

          var content = c.label

          if(c.type == "choose"){
            content = <input type="checkbox" name="selectall"/>
          }else{
            if(c.sort)
              content = <a onClick={this.setSorter.bind(this, c.sort)}>{content}&nbsp;<i className="fa fa-sort"></i></a>
          }

          return <th key={idx} className={className}>
            {content}
          </th>
        }, this)

    if(tableDescriptor.actions.length)
      items.push(<th key={items.length}>Action</th>)

    return <thead>{items}</thead>
  }
})

var TableRow = React.createClass({
  render: function(){

    var entry = this.props.entry,
        tableDescriptor = this.props.tableDescriptor,
        rowAction = tableDescriptor.rowAction,
        items = []

    if(tableDescriptor.sortable)
      items.push(<td className="draggable" key={items.length}><i className="fa fa-bars"/></td>)


    items = _.union(items, _.map(tableDescriptor.cells, function(c, idx){
      var className = cx({
        choose: c.type == "choose",
        "primary-column": c.primary == true,
        "expand": c.expand == true,
        "clickable": c.clickable == true
      })

      if(c.type.className)
        className += " " + c.type.className

      var content = c.type.content(entry)

      var rowActionFun = function(){
        if(rowAction && !c.type.skipRowAction)
          rowAction(entry)
      }

      return <td key={"col-"+idx} className={className} onClick={rowActionFun}>{content}</td>
    }, this))


    if(tableDescriptor.actions.length){
      var actions = _.map(tableDescriptor.actions, function(e){
        return e(entry)
      })
      items.push(<td className="action" key={items.length}>{actions}</td>)
    }

    var rowClassName = null
    if(tableDescriptor.rowClassName){

      if(_.isString(tableDescriptor.rowClassName))
        rowClassName = tableDescriptor.rowClassName

      if(_.isFunction(tableDescriptor.rowClassName))
        rowClassName = tableDescriptor.rowClassName(entry)
    }

    if(tableDescriptor.sortable){
      return <SortItem itemClassName={rowClassName} domType="tr" key={entry.id} id={entry.id}>{items}</SortItem>
    }else{
      return <tr className={rowClassName}>{items}</tr>
    }

  }
})

var Table = React.createClass({

  propTypes: {
    entries: React.PropTypes.array.isRequired,
    tableDescriptor: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      searchFilter: "",
      numResultPerPage: (this.props.tableDescriptor.noPagination ? null : 20),
      page: 0,
      sort: this.props.tableDescriptor.sort||null,
      sortOrder: this.props.tableDescriptor.sortOrder||1
    }
  },

  onSearchBoxChange: function(search){
    this.setState({searchFilter: search, page: 0})
  },

  onNumResultPerPageChange: function(num){
    this.setState({numResultPerPage: num, page: 0})
  },

  onPageClick: function(page){
    // TODO: properly handle page reloads / navigation without losing current page
    // Router.transitionTo("users", {}, {page: page})
    this.setState({page: page})
  },

  setSorter: function(sort){
    this.setState({sort: sort})
  },

  toggleSorterOrder: function(){
    this.setState({sortOrder: this.state.sortOrder * -1})
  },

  sort: function(entries){
    if(this.state.sort){
      var sorted = _.sortBy(entries, this.state.sort)

      if(this.state.sortOrder == -1)
        return sorted.reverse()

      return sorted
    }

    return entries
  },

  onCsvDownloadClick: function() {
    var fields = this.props.tableDescriptor.csvDownloadFields
    var filePrefix = this.props.tableDescriptor.csvFilePrefix || 'download'
    var values = _.map(this.props.entries, function (entry) {
      return _.map(fields, function (field) {
        return _.reduce(field[0].split('.'), (e, i) => e[i], entry)
      })
    })
    var data = [_.map(fields, (e) => e[1])].concat(values)
    var csvContent = "";
    data.forEach(function(infoArray, index){
       dataString = infoArray.join(",");
       csvContent += index < data.length ? dataString+ "\n" : dataString;
    });

    var fileName = filePrefix + Moment().format("YYYYMMDD") + '.csv';
    download(fileName, 'csv', csvContent);
  },

  render: function(){
    var entries = this.props.entries,
        tableDescriptor = this.props.tableDescriptor,
        filter = tableDescriptor.filter,
        searchFilter = this.state.searchFilter,
        filteredEntries = _.select(entries, function(e){
          if(filter && searchFilter.length)
            return !!filter(e, searchFilter)

          return true
        }),
        numResultPerPage = this.state.numResultPerPage||filteredEntries.length,
        sortedFilteredEntries = this.sort(filteredEntries),
        limitedEntries = sortedFilteredEntries.slice(this.state.page*numResultPerPage, this.state.page*numResultPerPage + numResultPerPage),
        tableRows = _.compact(_.map(limitedEntries, function(entry, idx){
          if (entry !== undefined) {
            return <TableRow key={entry.id} entry={entry} tableDescriptor={tableDescriptor}/>
          } else { return null }
        }, this))

    if(tableDescriptor.sortable && !tableDescriptor.noPagination)
      throw "table does not support sortable with pagination"

        // <QuickActions/>

    var filterLabel = "Search by" + (tableDescriptor.filterLabel ? " " + tableDescriptor.filterLabel.join(", "): "") + "..."

    var rowHeader = tableDescriptor.noRowHeader ? null : <TableRowHeader setSorter={this.setSorter} toggleSorterOrder={this.toggleSorterOrder} tableDescriptor={tableDescriptor}/>,
        searchBox = tableDescriptor.noSearchBox ? null : <SearchBox onChange={this.onSearchBoxChange} filterLabel={filterLabel}/>,
        numResultPerPageBox = tableDescriptor.noPagination ? null : <NumResultsPerPageChooser num={numResultPerPage} onChange={this.onNumResultPerPageChange}/>,
        csvDownloadBox = tableDescriptor.csvDownloadFields ? <CsvDownloadBox onClick={this.onCsvDownloadClick}/> : null,
        pagination = tableDescriptor.noPagination ? null : <Pagination onClickPage={this.onPageClick} numPerPage={numResultPerPage} page={this.state.page} numTotal={sortedFilteredEntries.length}/>

    var dragEndHandler = function(res){
      var sortedEntries = res.sortArray(entries,{inlineSorting:true});

      if(tableDescriptor.sortAction)
        tableDescriptor.sortAction(sortedEntries)

      this.forceUpdate()
    }

    var tbody = <tbody>{tableRows}</tbody>

    if(tableDescriptor.sortable){
      var colSpan = tableDescriptor.cells.length

      tbody = <SortContainer onDragEnd={dragEndHandler.bind(this)} domType="tbody" colSpan={colSpan+1}>
        {tableRows}
      </SortContainer>
    }

    var topForm = null

    var onSubmit = function(){ return false }

    if(searchBox || numResultPerPageBox){
      topForm = <form className="ebe-form" onSubmit={onSubmit}>
        <div className="list-view-actions">
          {searchBox}
          {numResultPerPageBox}
          {csvDownloadBox}
        </div>
      </form>
    }

    var tableClassName = tableDescriptor.tableClassName||""

    return <div>
      {topForm}

      <div className="list-view-spacing">
        <table className={"table list-view " + tableClassName} cellPadding="0" cellSpacing="0">
          {rowHeader}
          {tbody}
        </table>
        {pagination}
      </div>
    </div>

  }
})

var EditableTextCell = React.createClass({

  propTypes: {
    model: React.PropTypes.object.isRequired,
    attribute: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired
  },

  getInitialState: function(){
    return {editMode: false, value: this.props.model[this.props.attribute]||""}
  },

  onChange: function(e){
    this.setState({value: e.target.value})
  },

  onClick: function(e){
    e.stopPropagation()
    this.setState({editMode: !this.state.editMode}, function(){
      if (this.state.editMode)
        var input = this.refs.editor.getDOMNode()
        input.focus()
        input.select()
    });
  },

  onKeyDown: function(e){
    if(e.which == 13)
      this.stopEditing()
  },

  onBlur: function(){
    this.stopEditing()
  },

  modelValue: function(){
    return this.props.model[this.props.attribute]
  },

  stopEditing: function(){
    this.setState({editMode: false})
    if(this.modelValue() !== this.state.value){
      Dispatcher.handleViewAction({type: this.props.type+"_UPDATE", id: this.props.model.id, values: _.object([[this.props.attribute, this.state.value]])})
    }
  },

  // preventing input from triggering redirect
  onInputClick: function() {
    return false;
  },

  render: function(){
      var input = <input  ref="editor" type="text"
                          value={this.state.value}
                          style={{width:"100%"}}
                          onKeyDown={this.onKeyDown}
                          onBlur={this.onBlur}
                          onChange={this.onChange}
                          onClick={this.onInputClick}/>;

    return (
      <div className="editable-text-cell">
        {this.state.editMode ? null : <button type="button" onClick={this.onClick} className="btn editable-text-cell-btn"><i className="fa fa-edit"></i></button>}
        {this.state.editMode ? input : this.state.value}
      </div>
      )
  }
})

var Type = {
  text: function(fun){
    return {
      content: function(entry){
        return fun(entry)
      },
      skipRowAction: false
    }
  },
  component: function(fun){
    return {
      content: function(entry){
        return fun(entry)
      },
      skipRowAction: true
    }
  },
  editableText: function({type, attribute}){
    return {
      content: function(entry){
        return <EditableTextCell model={entry} attribute={attribute} type={type}/>
      },
      skipRowAction: false
    }
  },
  money: function(fun){
    return {
      content: function(entry){
        var {amount,currency} = fun(entry)
        return formatMoney(amount, currency)
      },
      skipRowAction: false
    }
  },
  date: function(fun, nullLabel){
    return {
      content: function(entry){
        var date = fun(entry)

        if(!date)
          return nullLabel||null

        return Moment(date).format("MMM Do, YYYY")
      },
      skipRowAction: false
    }
  },
  image: function(fun){
    return {
      content: function(entry){
        var src = fun(entry)
        return src ? <img src={src}/> : <div className="file-empty"><i className="fa fa-image"></i></div>
      },
      skipRowAction: false,
      className: "image"
    }
  },
  icon: function(fun) {
    return {
      content: function(entry) {
        var iconName = "icon flaticon-" + fun(entry)
        return <i className={iconName}/>
      },
      skipRowAction: false,
      className: "table-icon"
    }
  },
  faIcon: function(fun) {
    return {
      content: function(entry) {
        var iconName = "fa fa-" + fun(entry)
        return <i className={iconName}/>
      },
      skipRowAction: false,
      className: "table-icon"
    }
  },
  toggle: function({type, attribute, on, off, disabled}){
    if(type != type.toUpperCase())
      throw "type should be defined in uppercase; " + type.toUpperCase() + " instead of " + type

    return {
      content: function(entry){

        var onChangeFun = function(){
          if(disabled && disabled(entry))
            return

          var updateEntry = copy(entry)
          updateEntry[attribute] = !updateEntry[attribute]
          Dispatcher.handleViewAction({type: type + "_UPDATE", id: updateEntry.id, values: updateEntry})
        }

        var checked = !!entry[attribute]

        return <label className="switch" style={{maxWidth:150,minWidth:60}}>
          <input type="checkbox" className="switch-input" checked={checked} onChange={onChangeFun}/>
          <span className="switch-label" data-on={on||"Yes"} data-off={off||"No"}></span>
          <span className="switch-handle"></span>
        </label>
      },
      skipRowAction: true
    }
  }
}

Table.Type = Type

module.exports = Table
