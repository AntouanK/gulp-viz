/*** @jsx React.DOM
 */

'use strict';

//  require react
var React = require('react'),
    AppConstants = require('../constants/app-constants'),
    SessionView = require('../components/SessionView.react'),
    views,
    View;

views = {};
views[AppConstants.view.landing] = <div><span>Landing.</span></div>;
views[AppConstants.view.session] = <SessionView />;

var View = React.createClass({

  render: function(){

    console.log('View', 'render()', this.props.view);

    return (
      <div id="view-wrapper">
        <div id="view-container">
          {views[this.props.view.name]}
        </div>
      </div>
    );
  }
});

module.exports = View;
