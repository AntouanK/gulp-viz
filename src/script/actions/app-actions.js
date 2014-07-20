/* app-actions.js */

'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher.js'),
    AppConstants = require('../constants/app-constants'),
    AppActions;

AppActions = {

  setView: function(item){
    AppDispatcher.handleNavBarAction({
      actionType: AppConstants.set_view,
      item: item
    });
  }
};

module.exports = AppActions;
