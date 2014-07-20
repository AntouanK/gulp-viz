/* app-dispatcher.js */

var Dispatcher = require('./Dispatcher');

var merge = require('react/lib/merge');

var AppDispatcher = merge(Dispatcher.prototype, {

  /**
   * @param  {object} action The data coming from the nav-bar
   */
  handleNavBarAction: function(action) {
    this.dispatch({
      source: 'NAV-BAR_ACTION',
      action: action
    });
  }

});

module.exports = AppDispatcher;
