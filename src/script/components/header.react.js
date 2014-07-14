/**
 * @jsx React.DOM
 */


var React = require('react');

var Header = React.createClass({
  propTypes: {
    options: ReactPropTypes.object.isRequired
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
    console.log('componentDidMount');
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
    console.log('componentDidMount');
  },

  render: function(){
    return (
      <div>
        <ul>
          <li>option 1</li>
          <li>option 2</li>
        </ul>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
    console.log('_onChange');
  }
});


module.exports = Header;
