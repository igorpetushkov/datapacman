var _ = require('lodash');

var Hub = require('../hub/Hub');
var Constants = require('../constants/Constants');

var SimpleStore = function(){
    var _store = _.map(_.range(0, Constants.STORE_SIZE), function(id){
        var cases = [_.random(-50, -1), ''];
        return {
            id: id,
            value: cases[_.random(1)],
            selected: false
        };
    });

    this.add = function(data){
        _store.push(data);
    };

    this.getAll = function(){
        return _store;
    };

    this.update = function(value){
        _store = _store.map(function(obj){
            if(obj.selected) {
                obj.value = value;
            }
            return obj;
        });
    };

    this.select = function(id){
        _store = _store.map(function(obj){
            if(obj.id === id){
                obj.selected = !obj.selected;
            }else{
                obj.selected = false;
            }
            return obj;
        });
    };

    this.init = function(){
        var priority = Constants.EventPriority.STORE;

        Hub.subscribe(Constants.PlanetEvent.RAM_UPDATE, this.update, priority);
        Hub.subscribe(Constants.PlanetEvent.RAM_ADD, this.add, priority);
        Hub.subscribe(Constants.PlanetEvent.RAM_SELECT, this.select, priority);
    };

};

module.exports = new SimpleStore();