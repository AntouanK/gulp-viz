/**
 * @jsx React.DOM
 */

'use strict';

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var React         = require('react'),
    AppStore      = require('../stores/app-store'),
    Header        = require('./Header.react'),
    View          = require('./View.react'),
    VizApp;


VizApp = React.createClass({

  getInitialState: function() { 
    return {
      activeView: AppStore.getActiveView()
    };
  }, 

  componentDidMount: function() { 
    AppStore.addChangeListener(this._onChange); 
  }, 

  componentWillUnmount: function() { 
    AppStore.removeChangeListener(this._onChange); 
  }, 

  /**
   * @return {object}
   */
  render: function() {
    console.log('VizApp.render()');
    return (
      <section>
        <Header views={AppStore.getViews()} />
        <View view={this.state.activeView} />
      </section>
    );
  },

  _onChange:function(){
    this.setState({
      activeView: AppStore.getActiveView()
    });
  }
});

module.exports = VizApp;
