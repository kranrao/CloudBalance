/**
 * @jsx React.DOM
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var AppConstants = require('../constants/appConstants');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _files = {};
var _levels = {};



var updateLevels = function(levels, cloudService) {
  _levels[cloudService] = levels;
}

var enterFolder = function(folderName, cloudService) {
  _levels[cloudService].push(folderName);
}

var updateFiles = function(files, cloudService) {
  _files[cloudService] = files;
}

var AppStore = assign({}, EventEmitter.prototype, {

  initialize: function(cloudService) {
    _levels[cloudService] = [cloudService];
    _files[cloudService] = [];
  },

  //return an object with all of the files
  getFiles: function(cloudService) {
    return _files[cloudService];
  },

  getLevels: function(cloudService) {
    return _levels[cloudService];
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload){

    var action = payload.action; 
    switch(action.actionType){
      
      case AppConstants.UPDATE_LEVELS:
        updateLevels(action.levels, action.cloudService);
        break;

      case AppConstants.ENTER_FOLDER:
        enterFolder(action.folderName, action.cloudService);
        break;

      case AppConstants.UPDATE_FILES:
        updateFiles(action.files, action.cloudService);
        break;

    }

    AppStore.emitChange();
    return true;
  })

});

module.exports = AppStore;
