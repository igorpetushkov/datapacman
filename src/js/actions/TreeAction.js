var Constants = require('../constants/Constants');
var dispatch = require('./Action').dispatch;


module.exports = {
    getAll: function(){
        dispatch(Constants.TreeEvent.TREE_GET_ALL);
    },
    add: function(args){
        dispatch(Constants.TreeEvent.TREE_ADD, args);
    },
    remove: function(args){
        dispatch(Constants.TreeEvent.TREE_REMOVE, args, true);
    },
    select: function(args){
        dispatch(Constants.TreeEvent.TREE_SELECT, args);
    }
};
