var Constants = require('../constants/Constants');

var RAMStore = require('./RAMStore');
var TreeStore = require('./TreeStore');

module.exports = {
    initAll: function(storeTypes){
        if(!Array.isArray(storeTypes)) storeTypes = [storeTypes];

        storeTypes.forEach(function(storeType){
            var store = this.get(storeType);
            if(store) store.init();
        }.bind(this));
    },
    get: function(storeType){
        return this._findStore(storeType);
    },
    _findStore: function(storeType){
        switch(storeType) {
            case Constants.StoreType.RAM:
                return RAMStore;
            case Constants.StoreType.TREE:
                return TreeStore;
        }
    }
};