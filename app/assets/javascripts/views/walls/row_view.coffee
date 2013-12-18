App.RowView = Ember.View.extend
  classNames: ['row']
  classNameBindings: ['rowNumber']
  attributeBindings: ['style', 'data-row']
  templateName: 'wall/row'

  rowNumber: (->
    "row-#{@get('row')}"
  ).property('rowNumber', 'row')

  'data-row': (->
    @get('row')
  ).property('data-row', 'row')

  notes: (->
    row = @get('row')
    @get("controller.row_#{row}")
  ).property('row', 'controller.row_1', 'controller.row_2', 'controller.row_3', 'controller.row_4', 'controller.row_4')
