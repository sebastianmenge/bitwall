App.Wall = DS.Model.extend
  name:         DS.attr('string')
  notes:        DS.hasMany('note', {async: true})
  heightOne:    DS.attr('string')
  heightTwo:    DS.attr('string')
  heightThree:  DS.attr('string')


App.Wall.FIXTURES = [
  {
    id: 1
    name: 'Main Wall'
    notes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    heightOne: "33.3"
    heightTwo: "33.3"
    heightThree: "33.3"
  }
]
