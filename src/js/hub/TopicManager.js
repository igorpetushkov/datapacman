"use strict";

var assign = require('object-assign');
var Promise = require('es6-promise').Promise;
var _ = require('lodash');

var Dispatcher = require('./Dispatcher');


/*
 *   {
 *      name : [{
 *          callback: <function>,
 *          priority: <number>
 *      }]
 *   }
 *
 */
var _topics = [];

/*
 *   custom implementation of the PUB/SUB logic based on our Dispatcher
 *   of course, we can just use NodeJS Events API but we need priority feature
 */
module.exports = assign({}, Dispatcher, {
    add: function (topic, callback, priority) {
        if (!Array.isArray(_topics[topic])) {
            _topics[topic] = [];
        }

        _topics[topic].push({
            callback: callback,
            priority: priority || 0
        });

        this.addEventListener(topic, callback);
    },
    remove: function (topic, callback) {
        if (_topics[topic]) {
            _topics[topic] = _topics[topic].filter(function (obj) {
                return callback !== obj.callback
            });

            this.removeListener(topic, callback);
        }
    },
    removeAll: function (topic) {
        if (_topics[topic]) {
            delete _topics[topic];
            this.removeAllListeners(topic);
        }
    },
    do: function (topic, args) {
        this.emit(topic, args);
    },
    doAsync: function (topic, args) {
        var topicSortedByPriority = this.getAllWithPriority(topic);
        if (topicSortedByPriority) {
            /*
             *   How to work priority in async way.
             *
             *   So, we have some callback (topic) list with priority attributes.
             *   List is starting with the highest priority.
             *   If one of the callback throw exception and as result reject() is called we
             *   call all other callback with the same priority BUT not other priorities.
             *
             *   For example we have 6 topics:
             *
             *   [
             *      topic{3, callback3_1},  // 3 priority
             *      topic{3, callback3_2},  // 3 priority
             *      topic{2, callback2_1},  // 2 priority
             *      topic{2, callback2_2},  // 2 priority
             *      topic{1, callback1_1},  // 3 priority
             *      topic{1, callback1_2}   // 3 priority
             *   ]
             *
             *   Only if callback3_2 resolves we will call callback2_1 (and then callback2_1, callback2_2, ...)
             *   Only if callback2_2 resolves we will call callback1_1.
             *   If callback3_1 throw an exception then we call callback3_2 and stop - callback2_1 won't we called.
             *   The same with callback2_1. If if throw an exception - only callback2_2 will be called.
             *
             */

            // make out list look like an iterable collection:
            topicSortedByPriority.current = 0;
            topicSortedByPriority.next = function(){
                return this[this.current++];
            };

            // if one of the callback throw an exception we will make oneLevelCall == true
            // to indicate that we don't need to call callbacks of the other priorities
            var onePriorityCall = false;
            var recursivePromiseCall = function(topic){
                if(!topic) return null;

                var promise = new Promise(function(resolve, reject){
                    try {
                        var result = topic.callback(args);
                        resolve(result);
                    } catch(e) {
                        reject(e);
                    }
                });
                promise.then(function(result){
                    var nextTopic = topicSortedByPriority.next();

                    // don't call callback of the other level if oneLevelCall indicator is set
                    if(onePriorityCall && nextTopic.priority !== topic.priority) return;

                    recursivePromiseCall(nextTopic);
                }, function(error){
                    onePriorityCall = true;

                    var nextTopic = topicSortedByPriority.next();
                    if(nextTopic.priority === topic.priority){
                        recursivePromiseCall(nextTopic);
                    }
                });
            };
            recursivePromiseCall(topicSortedByPriority.next());
        }
    },
    getAll: function (topic) {
        return this.listeners(topic);
    },
    getAllWithPriority: function (topic) {
        if (
            _topics[topic]) {
            return _.sortBy(_topics[topic], 'priority');
        }
    }
});