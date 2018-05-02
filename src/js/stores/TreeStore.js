var _ = require('lodash');

var Hub = require('../hub/Hub');
var Constants = require('../constants/Constants');

var TreeStore = function(){
    var _store = [];
    this.add = function(value){
        _store.push({
            id: _store.length ? _store.length : 0,
            value: value,
            selected: false
        });
    };

    this.getAll = function(){
        return _store;
    };

    this.remove = function(id){
        var indexToRemove = null;
        _store.forEach(function(obj, i){
            if(obj.id === id && !indexToRemove){
                indexToRemove = i;
            }
        });
        _store.splice(indexToRemove, 1);
    };

    this.select = function(id){
        _store = _store.map(function(obj){
            if(obj.id === id){
                obj.selected = true;
                return obj;
            }
        });
    };

    this.init = function(){
        var priority = Constants.EventPriority.TREE;

        Hub.subscribe(Constants.TreeEvent.TREE_ADD, this.add, priority);
        Hub.subscribe(Constants.TreeEvent.TREE_GET_ALL, this.getAll, priority);
        Hub.subscribe(Constants.TreeEvent.TREE_REMOVE, this.remove, priority);
        Hub.subscribe(Constants.TreeEvent.TREE_SELECT, this.select, priority);
    };

};

module.exports = new TreeStore();