var assign = require('object-assign');

var TopicManager = require('./TopicManager');


var Hub = assign({}, TopicManager, {
    subscribe: function(topic, callback, priority) {
        this.add(topic, callback, priority);
    },
    unsubscribe: function(topic, callback){
        this.remove(topic, callback);
    },
    unsubscribeAll: function(topic){
        this.removeAll(topic);
    },
    publish: function(topic, args){
        this.do(topic, args);
    },
    publishAsync: function(topic, args){
        this.doAsync(topic, args);
    }
});

Hub.dispatchToken = Hub.register(function(action) {
    if(action.type){
        if(action.async){
            Hub.publishAsync(action.type, action.args);
        }else{
            Hub.publish(action.type, action.args);
        }
    }
});

module.exports = Hub;