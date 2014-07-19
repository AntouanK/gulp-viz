/*** @jsx React.DOM
 */

'use strict';

//  require react
var React = require('react'),
    AppConstants = require('../constants/app-constants'),
    views,
    SessionView;

SessionView = React.createClass({

  render: function(){

    return (
      <div className="row">
        <div className="columns small-centered">
          <h2>Session</h2>
        </div>
      </div>
    );
  }
});

module.exports = SessionView;
