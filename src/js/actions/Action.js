var Hub = require('../hub/Hub');

module.exports = {
    dispatch: function(type, args, async){
        Hub.dispatch({
            type: type,
            args: args,
            async: !!async
        });
    }
};