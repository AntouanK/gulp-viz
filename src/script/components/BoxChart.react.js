/*** @jsx React.DOM
 */

/* BoxChart.react.js */

'use strict';

var React        = require('react'),
    d3           = require('d3'),
    AppConstants = require('../constants/app-constants'),
    BoxChart;


BoxChart = React.createClass({

  componentWillMount: function(){

  },

  componentDidMount: function(){

    var thisEle            = this.getDOMNode(),
        dataset            = this.props.dataset,
        availHeight        = 600,
        availWidth         = thisEle.offsetWidth,
        transitionDuration = 500,
        transitionDelay    = 100,
        rectWidth,
        margin             = 2,
        dataMaxValue,
        x,
        y,
        axis,
        axisWidth          = 50;

    //  make room for the axis
    availWidth -= axisWidth;

    //  axis
    axis = d3.svg.axis().orient('left').ticks(30);

    //  make the dataset an array
    dataset = Object.keys(dataset).map(function(key){
      return dataset[key];
    });

    rectWidth = availWidth / dataset.length;

    dataMaxValue = d3.max( dataset, function(d) { return d.maxTime; });

    // x = d3.scale.linear().domain([0, dataset.length]).range([ 0, availWidth ]);
    y = d3.scale.linear().domain([0, dataMaxValue]).range([ 0, availHeight ]);

    var nodes = 
      d3.select(thisEle.querySelector('.group'))
        .attr('transform', 'translate('+ axisWidth +', 0)')
        .selectAll('g')
        .data(dataset)
      .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d, i){
          return 'translate( '+ ((i * rectWidth) + margin) +', '+ y(d.minTime) +')';
        });

    //Create the Scale we will use for the Axis
    var axisScale = d3.scale.linear()
                             .domain([0, dataMaxValue])
                             .range([0, availHeight]);
    
    //Create the Axis
    var yAxis = d3.svg.axis().orient('left')
                      .scale(axisScale);

    d3.select(thisEle.querySelector('.group'))
    .call(yAxis);

    nodes
      .append('rect')
      .attr('width', ( rectWidth - (margin*2) ) +'px')
      .attr('height', function(d,i){
        return y(d.maxTime) + 'px';
      });

    nodes
      .append('text')
      .attr('dy', 10)
      .text(function(d, i){
        return d.events[0].id;
      });

  },

  render: function(){

    console.log('this.props.dataset', this.props.dataset);
    var dataset = this.props.dataset;

    return (
      <svg className="line-chart">
        <g className="group">
        </g>
      </svg>
    );
  }
});

module.exports = BoxChart;
