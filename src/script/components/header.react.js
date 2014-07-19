/*** @jsx React.DOM
 */

'use strict';

//  require react
var React = require('react');
//  require the available actions
var AppActions = require('../actions/app-actions.js');

var ViewLink = React.createClass({

  handleClick: function(ev){
    AppActions.setView({
      viewName: this.props.viewName
    });
  },

  render: function(){
  
    return (
      <a onClick={this.handleClick}>{this.props.label}</a>
    );
  }
});

var Header = React.createClass({

  propTypes: {
    views: React.PropTypes.array.isRequired
  },

  componentDidMount: function() {
    // TodoStore.addChangeListener(this._onChange);
    // console.log('componentDidMount');
  },

  componentWillUnmount: function() {
    // TodoStore.removeChangeListener(this._onChange);
    // console.log('componentDidMount');
  },

  render: function(){
    var views = this.props.views;
    var thisHeader = this;

    return (
      <nav className="top-bar">
        <section className="top-bar-section">
          <div className="logo" />
          <ul className="right">
            {Object.keys(views).map(function(key){
              return (
                <li>
                  <ViewLink viewName={views[key].name} label={views[key].label} />
                </li>
              );
            })}
          </ul>
        </section>
      </nav>
    );
  }
});


module.exports = Header;
