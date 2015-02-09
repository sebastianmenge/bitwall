/** @jsx React.DOM */

jest.dontMock('../number_input.jsx');

var {renderIntoDocument, Simulate} = require('react/addons').addons.TestUtils,
    NumberInput = require('../number_input.jsx');


describe('number input test', function() {

  it('allows to enter a floating number by default', function() {
    var component = renderIntoDocument(<NumberInput/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe(null);
    Simulate.change(node, { target: { value: '21.3' } })
    expect(component.state.value).toBe('21.3');
  });

  it('allows to remove a number', function() {
    var component = renderIntoDocument(<NumberInput value={12.3}/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12.3');
    Simulate.change(node, { target: { value: '' } })
    expect(component.state.value).toBe('');
  });


  it('does not allow to enter a letter', function() {
    var component = renderIntoDocument(<NumberInput value={12.3}/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12.3');
    Simulate.change(node, { target: { value: '12.3a' } })
    expect(component.state.value).toBe('12.3');
  });


  it('allows to enter a negative number', function() {
    var component = renderIntoDocument(<NumberInput value={12.3}/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12.3');
    Simulate.change(node, { target: { value: '-12.3' } })
    expect(component.state.value).toBe('-12.3');
  });


  it('allows not to enter a negative number if onlyPositive is set', function() {
    var component = renderIntoDocument(<NumberInput value={12.3} onlyPositive/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12.3');
    Simulate.change(node, { target: { value: '-12.3' } })
    expect(component.state.value).toBe('12.3');
  });

  it('allows not to enter a floating number if onlyDecimal is set', function() {
    var component = renderIntoDocument(<NumberInput value={12.3} onlyDecimal/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12');
    Simulate.change(node, { target: { value: '14.4' } })
    expect(component.state.value).toBe('12');
    Simulate.change(node, { target: { value: '-12' } })
    expect(component.state.value).toBe('-12');
  });

  it('deals properly with precision', function() {
    var component = renderIntoDocument(<NumberInput value={12.123567} precision={3}/>),
        node = component.getDOMNode();
    expect(component.state.value).toBe('12.124');
    Simulate.change(node, { target: { value: '12.12' } })
    expect(component.state.value).toBe('12.12');
    Simulate.change(node, { target: { value: '12.1234' } })
    expect(component.state.value).toBe('12.12');
    Simulate.change(node, { target: { value: '-12.123' } })
    expect(component.state.value).toBe('-12.123');

    component = renderIntoDocument(<NumberInput value={12.12} precision={3}/>);
    node = component.getDOMNode();
    expect(component.state.value).toBe('12.120');
  });

})