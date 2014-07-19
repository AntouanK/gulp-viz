'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher'),
    AppConstants = require('../constants/app-constants'),
    AppStore,
    merge = require('react/lib/merge'),
    EventEmitter = require('events').EventEmitter,
    CHANGE_EVENT = "change",
    _views,
    _activeViewIndex = 0,
    _getActiveView,
    _setActiveView;

_views = [
  {
    id: 0,
    name: AppConstants.view.landing,
    label: 'Main'

  },
  {
    id: 1,
    name: AppConstants.view.session,
    label: 'Session'
  }
];

//  function to return the currently active view
_getActiveView = function(){
  return _views[_activeViewIndex];
};

_setActiveView = function(item){

  var viewName = item.viewName;

  if(typeof viewName !== 'string'){
    return false;
  }

  _views.forEach(function(view, i){

    if(view.name === viewName){
      _activeViewIndex = i;
    }
  });
};

AppStore = merge(EventEmitter.prototype, {

  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  getViews: function(){
    return _views;
  },

  getActiveView: function(){
    return _getActiveView();
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction

    switch(action.actionType){
      case AppConstants.set_view:

        _setActiveView(payload.action.item);
        break;

    }

    AppStore.emitChange();

    return true;
  })
})

module.exports = AppStore;
