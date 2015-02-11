var Chosen = require("react-chosen"),
    _ = require("underscore"),
    findImageUrl = require("../../util.js").findImageUrl,
    RichTextEditor = require("../rich_text_editor.jsx"),
    AssemblyUpload = require("../assembly_upload.jsx"),
    AutoGrowTextarea = require("../auto_grow_textarea.jsx"),
    DurationInput = require("../duration_input.jsx"),
    NumberInput = require("../number_input/number_input.jsx"),
    DateInput = require("../date_input/date_input.jsx"),
    TagsInput = require("../tags_input/tags_input.jsx"),
    ColorInput = require("../color_input/color_input.jsx"),
    React = require("react");

var Type = {}

Type.register = function(name, inputControl, convertValue, readonly){
  if(!convertValue)
    convertValue = function(field, opts, e){
      return e.target.value
    }

  this[name] = function(opts){
    return {
      name: name,
      opts: opts||{},
      inputControl: inputControl,
      convertValue: convertValue,
      readonly: readonly
    }
  }
}

Type.register("money", function(field, opts){
  return <div className="input-group">
    <span className="input-group-addon">{opts.currency}</span>
    <NumberInput
      value={field.value/100}
      onlyPositive={true}
      precision={2}
      onChange={this.onChange.bind(this, field)}
      disabled={this.state.processing}
      />
  </div>
}, function(field, opts, e){
  return Math.round(e*100)
})

var textTypeFunction = function(field, opts){
  var maxLengthRule = _.detect(field.rules, e => e.maxLength)

  var input = <input autoFocus={field.autofocus} ref={field.ref} type="text" className={"form-control" + (maxLengthRule ? " form-control-counter" : "")} value={field.value} onChange={this.onChange.bind(this, field)} disabled={this.state.processing} placeholder={opts.placeholder}/>
  var inputCounter = maxLengthRule ? <span className="form-character-count">{field.value.length}/{maxLengthRule.maxLength}</span> : null

  if(!opts.addon){
    if(inputCounter)
      return <div>
        {input}
        {inputCounter}
      </div>

    return input
  }

  return <div className="input-group">
    <span className="input-group-addon">{opts.addon}</span>
    {input}
    {inputCounter}
  </div>
}

Type.register("text", textTypeFunction)
Type.register("upperCaseText", textTypeFunction, function (field, opts, e) {
  return e.target.value.toUpperCase()
})

Type.register("multiText", function(field, opts){
  // dangerouslySetInnerHTML={{__html: rawMarkup}}
  return <AutoGrowTextarea ref={field.ref} value={field.value} onChange={this.onChange.bind(this, field)} disabled={this.state.processing||opts.readonly} placeholder={opts.placeholder}/>
})

Type.register("richText", function(field, opts){
  return <RichTextEditor value={field.value} onChange={this.onChange.bind(this, field)} disabled={this.state.processing} htmlModeEnabled={opts.htmlModeEnabled}/>
}, function(field, opts, e){
  return e.target && e.target.value || e;
})

Type.register("toggle", function(field, opts){
  return <span><label className="switch" style={{maxWidth:150}}>
    <input type="checkbox" className="switch-input" checked={field.value} onChange={this.onChange.bind(this, field)}/>
    <span className="switch-label" data-on={opts.on} data-off={opts.off}></span>
    <span className="switch-handle"></span>
  </label>
  {opts.postEl ? opts.postEl(field.value) : null}
  </span>
}, function(field, opts, e){
  return !field.value
})

Type.register("checkbox", function(field, opts){
  return <input type="checkbox" checked={field.value} onChange={this.onChange.bind(this, field)} disabled={this.props.processing}/>
}, function(field, opts, e){
  return !field.value
})

Type.register("int", function(field, opts){
  var input = <NumberInput
    onlyDecimal={true}
    onlyPositive={opts.onlyPositive}
    value={field.value}
    onChange={this.onChange.bind(this, field)}
    disabled={this.state.processing}
    />

  if(!opts.addon){
    return input
  }

  return <div className="input-group">
    <span className="input-group-addon">{opts.addon}</span>
    {input}
  </div>
}, function(field, opts, e){
  return e;
})

Type.register("float", function(field, opts){
  return <NumberInput
    onlyPositive={opts.onlyPositive}
    precision={opts.precision}
    value={field.value}
    onChange={this.onChange.bind(this, field)}
    disabled={this.state.processing}
    />
}, function(field, opts, e){
  return e;
})

Type.register("chosenEnum", function(field, opts){
  var options = _.map(opts.enumArr, function(e, idx){
    return <option key={e.key} value={e.key}>{e.label}</option>
  }, this)

  var defaultValue = field.value ? field.value : null

  return <Chosen defaultValue={defaultValue} noResultsText="No result" width="300px" onChange={this.onChange.bind(this, field)} allowSingleDeselect={opts.deselectable==false?"":"true"}>
    <option></option>
    {options}
  </Chosen>

}, function(field, opts, e){
  return e.target.value ? (_.detect(opts.enumArr, (i => (i.key == e.target.value)))||{}).key : null
})

Type.register("chosen", function(field, opts){
  var optionLabelFor = function(option){
    return option.id.toString()
  }

  if(_.isString(opts.label))
    optionLabelFor = function(option){
      return option[opts.label]
    }

  if(_.isFunction(opts.label))
    optionLabelFor = function(option){
      return opts.label(option)
    }


  var options = _.map(opts.options, function(e, idx){
    var label = optionLabelFor(e)
    return <option key={e.id} value={e.id}>{label}</option>
  }, this)

  var defaultValue = field.value ? field.value.id : null

  return <Chosen defaultValue={defaultValue} noResultsText="No result" width="300px" onChange={this.onChange.bind(this, field)} allowSingleDeselect="true">
    <option></option>
    {options}
  </Chosen>
}, function(field, opts, e){
  return e.target.value ? _.where(opts.options, {id: parseInt(e.target.value, 10)})[0] : null
}, function(field, opts){

  var optionLabelFor = function(option){
    return option.id.toString()
  }

  if(_.isString(opts.label))
    optionLabelFor = function(option){
      return option[opts.label]
    }

  if(_.isFunction(opts.label))
    optionLabelFor = function(option){
      return opts.label(option)
    }


  var id = field.value ? field.value.id : null

  if(id){
    return optionLabelFor(_.where(opts.options, {id: id})[0])
  }else{
    return ""
  }
})


Type.register("multiChosen", function(field, opts){
  var optionLabelFor = function(option){
    return option.id.toString()
  }

  if(_.isString(opts.label))
    optionLabelFor = function(option){
      return option[opts.label]
    }

  if(_.isFunction(opts.label))
    optionLabelFor = function(option){
      return opts.label(option)
    }

  var options = _.map(opts.options, function(e, idx){
    var label = optionLabelFor(e)
    return <option key={e.id} value={e.id}>{label}</option>
  }, this)

  var value = _.pluck(_.isArray(field.value) ? field.value : [], "id")

  return <Chosen defaultValue={value} noResultsText="No result" width="300px" onChange={this.onChange.bind(this, field)} multiple>
    {options}
  </Chosen>
}, function(field, opts, e){
  return _.map($("option:selected", e.target).toArray(), function(selected){
    var id = parseInt($(selected).val(), 10)
    return _.where(opts.options, {id: id})[0]
  })
})

Type.register("media", function(field, opts){

  function onFinished(file){
    var newValue = {id: file.id, url: findImageUrl(file)}
    this.setValue(field, newValue)
  }

  function onCancelUpload(){
    this.setValue(field, field.initialValue)
  }

  var originalFile=field.value;
  if (!originalFile && opts.defaultUrlPath) {
    originalFile = {id:null, url: (field.model.ui||{})[opts.defaultUrlPath]}
  }

  return <div>
    <AssemblyUpload
      originalFile={originalFile}
      onCancelUpload={onCancelUpload.bind(this)}
      onFileCreated={this.onChange.bind(this, field)}
      type={opts.assemblyType}
      accept={opts.accept}
      name={field.name}
      onFinished={onFinished.bind(this)}
      modelId={field.model.id}
    /></div>
}, function(field, opts, e){
  return {id: e.id, url: e.url}
  // return e
})

Type.register("duration", function(field, opts){
  units = opts.units || ['seconds','minutes','hours','days','weeks'];
  return <DurationInput value={field.value} units={units} onChange={this.onChange.bind(this, field)} disabled={this.state.processing}/>
}, function(field, opts, e) {
  return e;
})


Type.register("date", function(field, opts){
  opts = opts||{};
  return <DateInput value={field.value} minDate={opts.minDate} maxDate={opts.maxDate} onChange={this.onChange.bind(this, field)} disabled={this.state.processing}/>
}, function(field, opts, e) {
  return e && e.toString();
})

Type.register("tags", function(field, opts){
  opts = opts||{};
  return <TagsInput value={field.value} options={opts.options} onChange={this.onChange.bind(this, field)} disabled={this.state.processing}/>
}, function(field, opts, e) {
  return e;
})

Type.register("color", function(field, opts){
  opts = opts||{};
  return <ColorInput value={field.value} onChange={this.onChange.bind(this, field)} disabled={this.state.processing}/>
}, function(field, opts, e) {
  return e;
})

module.exports = Type
