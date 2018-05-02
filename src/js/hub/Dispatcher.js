var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var FacebookFluxDispatcher = require('./FluxDispatcher');


/*
*   Dispatchers are organized here in prototype-based style via object-assign API ("mixin" pattern).
*/


/* create our initial object with EventEmitter parent */
var Dispatcher = Object.create(EventEmitter);

/*
*   put together features of the Flux dispatcher and NodeJS events
*   p.s. here we can also use just EventEmitter.prototype with assign
*   but let's use Object.create
*/
module.exports = assign({}, Dispatcher.prototype, {
    addEventListener: function(event, listener) {
        this.on(event, listener);
    },
    removeEventListener: function(event, listener) {
        this.removeListener(event, listener);
    },
    register: function(callback){
        return FacebookFluxDispatcher.register(callback);
    },
    dispatch: function(args){
        /* use facebook flux dispatch implementation */
        FacebookFluxDispatcher.dispatch(args);
    }
});