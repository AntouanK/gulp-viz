/*** @jsx React.DOM
 */

/* SessionView.react.js */

//  target graph ----> http://bl.ocks.org/mbostock/1093025

'use strict';

//  require react
var React        = require('react'),
    AppConstants = require('../constants/app-constants'),
    BoxChart     = require('../components/BoxChart.react'),
    views,
    SessionView;

//  helper functions
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

var getDataSet = function(sessionData){

  var dataset = {};

  Object.keys(sessionData.list)
  .forEach(function(key){
  
    var thisEvent = sessionData.list[key],
        newEvent = {
          id:           thisEvent.id,
          eventIndex:   thisEvent.eventIndex,
          label:        thisEvent.name,
          type:         thisEvent.type,
          timestamp:    timeStampToFloat(thisEvent.timestamp)
        };

    if(dataset[thisEvent.id] === undefined){
      dataset[thisEvent.id] = {
        events: []
      };
    }

    dataset[thisEvent.id].events.push(newEvent);

    if(dataset[thisEvent.id].events.length > 1){
      //  set max min times
      dataset[thisEvent.id].minTime = 
      Math.min(dataset[thisEvent.id].minTime, newEvent.timestamp);

      dataset[thisEvent.id].maxTime = 
      Math.max(dataset[thisEvent.id].maxTime, newEvent.timestamp);
      
    } else {
      dataset[thisEvent.id].minTime = newEvent.timestamp;
      dataset[thisEvent.id].maxTime = newEvent.timestamp;
    }


  });

  return dataset;
};


SessionView = React.createClass({

  componentWillMount: function(){
  
    console.log(this.props.session);
    console.log(getDataSet(this.props.session));
  },

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
            <BoxChart dataset={getDataSet(this.props.session)} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SessionView;
