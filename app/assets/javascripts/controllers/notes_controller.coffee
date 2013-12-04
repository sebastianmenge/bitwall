App.NotesController = Ember.ArrayController.extend
  row1: (->
    @filterBy('row', 1)
  ).property('row')

  row2: (->
    @filterBy('row', 1)
  ).property('row')

  row3: (->
    @filterBy('row', 1)
  ).property('row')
