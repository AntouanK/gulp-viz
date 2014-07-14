/**
 * @jsx React.DOM
 */

;(function(){

  'use strict';

  var VizApp = require('./components/vizApp.js');
  var React = require('react');
  var d3 = require('d3');

  React.renderComponent(
    <VizApp />,
    document.getElementById('viz-app')
  );

  console.log(React);
  console.log(d3);
  console.log(test);
})();


console.log('I\'m here!');
