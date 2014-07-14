/**
 * @jsx React.DOM
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var React = require('react');
var Header = require('./Header.react');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getVizState() {
  return {
    options: ['option 1', 'option 21']
  };
}

var VizApp = React.createClass({

  getInitialState: function() {
    return getVizState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        <Header options={this.state.options} />
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getVizState());
  }

});

module.exports = VizApp;
