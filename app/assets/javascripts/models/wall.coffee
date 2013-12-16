App.Wall = RL.Model.extend
  name:         RL.attr('string')
  rows:         RL.attr('number')
  notes:        RL.hasMany('App.Note')
  height1:    RL.attr('number')
  height2:    RL.attr('number')
  height3:    RL.attr('number')
  height4:    RL.attr('number')
