App.WallController = Ember.ObjectController.extend
  notes: (->
    Ember.ArrayProxy.createWithMixins Ember.SortableMixin,
      content: @get('content.notes')
  ).property('content.notes')

  row1: (->
    @get('notes').filterBy('row', 1)
  ).property('notes.@each')

  row2: (->
    @get('notes').filterBy('row', 2)
  ).property('notes.@each')

  row3: (->
    @get('notes').filterBy('row', 3)
  ).property('notes.@each')

