/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react'),
    VizApp = require('./components/VizApp.js');

React.renderComponent(
  <VizApp />,
  document.getElementById('viz-app')
);
