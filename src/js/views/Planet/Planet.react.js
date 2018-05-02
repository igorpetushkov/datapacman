var React = require('react');
var assert = require('assert');

var Button = require('react-bootstrap').Button;

var Hub = require('../../hub/Hub');
var Stores = require('../../stores/Stores');
var Constants = require('../../constants/Constants');
var PlanetRAMAction = require('../../actions/PlanetRAMAction');

var PlanetItem = require('./PlanetItem.react');


var Planet = React.createClass({
    propTypes: {},
    mixins : [],

    getInitialState: function(){
        return this._getDataFromStore();
    },
    getDefaultProps: function() {},

    componentDidMount: function(){
        Hub.subscribe(Constants.PlanetEvent.RAM_UPDATE, this._refresh, Constants.EventPriority.VIEW);
        Hub.subscribe(Constants.PlanetEvent.RAM_SELECT, this._refresh, Constants.EventPriority.VIEW);
    },
    componentWillUnmount: function(){
        Hub.unsubscribe(Constants.PlanetEvent.RAM_UPDATE, this._refresh, Constants.EventPriority.VIEW);
        Hub.unsubscribe(Constants.PlanetEvent.RAM_SELECT, this._refresh, Constants.EventPriority.VIEW);
    },

    _refresh: function(){
        var data = this._getDataFromStore();
        this.setState(data, function(){
        });
    },
    _getDataFromStore: function(){
        var store = Stores.get(Constants.StoreType[this.props.name]);
        return {
            items: store.getAll()
        };
    },

    onClickPlanetItem: function(obj){
        var weed = parseInt(obj.value);
        if(isNaN(weed)) return;

        if(weed > -1){
            toastr.info('Выберите сорняк (отрицательное число).');
        }else{
            PlanetRAMAction.select(obj.id);
        }
    },

    render: function(){
        assert(this.state.items && this.state.items.length === Constants.STORE_SIZE);

        var gridColumns = {};
        var gridColumnIndex = null;
        this.state.items.forEach(function(obj, i){
            if(i === 0){
                gridColumnIndex = i;
                gridColumns[i] = [];
            }

            if(i !== 0 && i % 5 === 0){
                // we can just move gridColumnIndex above from loop and do gridColumnIndex++
                // but we are not looking for the easy way :) #justfordemo
                gridColumnIndex = Number(Object.keys(gridColumns).pop()) + 1;
                gridColumns[gridColumnIndex] = [];
            }
            gridColumns[gridColumnIndex].push(
                <td key={obj.id}
                    className={obj.selected ? "selected" : ""}
                    onClick={this.onClickPlanetItem.bind(this, obj)}>
                    <PlanetItem value={obj.value} />
                </td>
            );
        }.bind(this));

        return (
            <div className="planet">
                <table>
                    {Object.keys(gridColumns).map(function(index, i){
                        return (
                            <tr key={i}>
                                {gridColumns[index]}
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
});

module.exports = Planet;
