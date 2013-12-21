App.Wall = RL.Model.extend
  name:         RL.attr('string')
  rows:         RL.attr('array')
  notes:        RL.hasMany('App.Note',  { readOnly: true })
  height1:    RL.attr('number')
  height2:    RL.attr('number')
  height3:    RL.attr('number')
  height4:    RL.attr('number')


App.RESTAdapter.registerTransform 'array',
  deserialize: (serialized)->
    unless !serialized
      serialized.map (row)-> parseInt(row)
  serialize: (deserialized)->
    unless !deserialized
      deserialized.map (row)-> row.toString()
