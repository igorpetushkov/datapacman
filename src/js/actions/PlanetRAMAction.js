var Constants = require('../constants/Constants');
var dispatch = require('./Action').dispatch;


module.exports = {
    refresh: function(){
        dispatch(Constants.PlanetEvent.RAM_REFRESH);
    },
    add: function(args){
        dispatch(Constants.PlanetEvent.RAM_ADD, args);
    },
    update: function(args){
        dispatch(Constants.PlanetEvent.RAM_UPDATE, args, true);
    },
    select: function(args){
        dispatch(Constants.PlanetEvent.RAM_SELECT, args);
    }
};
