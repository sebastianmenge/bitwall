App.Note = DS.Model.extend
  wall:     DS.belongsTo('wall')
  title:     DS.attr('string')
  body:     DS.attr('string')
  color:     DS.attr('string')
  width:     DS.attr('string')
  row:        DS.attr('number')

App.Note.FIXTURES = [
  {
    id: 1
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 1
  },
  {
    id: 2
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 1
  },
  {
    id: 3
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 1
  },
  {
    id: 4
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 1
  },
  {
    id: 5
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 1
  },
  {
    id: 6
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 2
  },
  {
    id: 7
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 2
  },
  {
    id: 8
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 2
  },
  {
    id: 9
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 2
  },
  {
    id: 10
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 3
  },
  {
    id: 11
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 3
  },
  {
    id: 12
    title: 'Stuff'
    body: "ljsdlfj lsdfjklsdjfj lsdjfl"
    color: "#99d492"
    width: "19"
    row: 3
  }
]
