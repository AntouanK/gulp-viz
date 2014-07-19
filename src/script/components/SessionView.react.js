/*** @jsx React.DOM
 */

'use strict';


//  taret graph ----> http://bl.ocks.org/mbostock/1093025


//  require react
var React        = require('react'),
    d3           = require('d3'),
    Mocks        = require('../_mocks'),
    AppConstants = require('../constants/app-constants'),
    views,
    SessionView;

console.log(Mocks);

var timeStampToFloat = function(array){

  var timeZero = ( (array[0]*1000000)+parseInt(array[1] / 1000, 10) );

  timeStampToFloat = function(array){
  
    if(typeof array !== 'object' || array.length === undefined){
      debugger;
    }

    return ( (array[0]*1000000)+parseInt(array[1] / 1000, 10) ) - timeZero;
  };

  return 0;
};

var getDataSet = function(){

  var dataset = [];

  // dataset.push({
  //   label: 'timeZero',
  //   type: 'timeZero',
  //   timeStamp: timeStampToFloat(Mocks.session001.timeZero)
  // });

  Object.keys(Mocks.session001.list)
  .forEach(function(key){
  
    var event = Mocks.session001.list[key],
        newItem = {
          label: event.name,
          type: event.type,
          timestamp: timeStampToFloat(event.timestamp)
        };

    dataset.push(newItem);
  });

  return dataset;
};

var LineChart = React.createClass({

  componentDidMount: function(){

    var thisEle = this.getDOMNode();
    var dataset = getDataSet();
    console.log(dataset);
    var availHeight = 150;
    var transitionDuration = 500;
    var transitionDelay = 100;

    var dataMaxValue = 
      d3.max( dataset, function(d) { return d.timestamp; });
  
    var x = d3.scale.linear().domain([0, dataset.length]).range([ 0, thisEle.offsetWidth ]);
    var y = d3.scale.linear().domain([0, dataMaxValue]).range([ availHeight, 0 ]);

    // offset
    // var graph = 
    // d3.select('body')
    //   .append( 'g' )
    //   .data(dataset)
    // .enter()
    //   .append('g')
    //   .attr('class', 'node');
      // .transition()
      // .duration(    function( d,i ){ return transitionDuration })
      // .delay(       function( d,i ){ return transitionDelay })
      // .attr( 'transform', 'translate(0, 0)' );

    // scale the range of the data
    // x.domain( [0, dataset.length - 1 ] );
    // y.domain( [0, dataMaxValue ]);

    // // draw the line
    // var graphLine = graph.append( 'path' )
    //   .attr( 'fill', 'green' )
    //   .attr( 'stroke', 'white' )
    //   .attr( 'd', valueline( dataset ));
  },

  render: function(){

    var dataset      = getDataSet();
    var availHeight  = 900;
    var dataMaxValue = 
      d3.max( dataset, function(d) { return d.timestamp; });
    var x            = 
      d3.scale.linear()
      .domain([0, dataset.length]).range([ 0, 950 ]);
    var y            = 
      d3.scale.linear()
      .domain([0, dataMaxValue]).range([ 0, availHeight ]);

    return (
      <svg className="line-chart">
        <g>
          {dataset.map(function(data, i){
            return (
              <g className="node" transform={"translate("+( x(i) )+",0)"}>
                <rect x="5" height={ y(data.timestamp) } width="5"></rect>
                <text dy="5.5" dx="2.5">dummy label</text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
});


SessionView = React.createClass({

  render: function(){

    return (
      <div>
        <div className="row">
          <div className="columns small-centered">
            <h2>Session</h2>
          </div>
        </div>
        <div className="row">
          <div className="columns small-centered">
            <LineChart />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SessionView;
