/* session-store.js */

'use strict';

var AppDispatcher    = require('../dispatchers/app-dispatcher'),
    AppConstants     = require('../constants/app-constants'),
    EventEmitter     = require('events').EventEmitter,
    merge            = require('react/lib/merge'),
    Mocks            = require('../_mocks'),
    SessionStore,
    CHANGE_EVENT     = 'change',
    _sessions        = [],
    _activeSessionIndex = 0,
    _setActiveSession;

//  get mock sessions
Mocks.forEach(function(mockSession){
  _sessions.push(mockSession);
});

_setActiveSession = function(index){

  if(index < 0 || index >= _sessions.length){
    return false; // no valid index
  }

  _activeSessionIndex = index;
  return true;
};


SessionStore = merge(EventEmitter.prototype, {

  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },

  getActiveSession: function(){
    return _sessions[_activeSessionIndex];
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction

    switch(action.actionType){
      case AppConstants.set_session:

        _setActiveSession(payload.action.item);
        break;

    }

    SessionStore.emitChange();

    return true;
  })
})

module.exports = SessionStore;
