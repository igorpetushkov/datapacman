var assert = require('assert');

var React = require('react');
var ReactPropTypes = React.PropTypes;

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var ModalTrigger = require('react-bootstrap').ModalTrigger;

var Hub = require('../../hub/Hub');
var TreeAction = require('../../actions/TreeAction');
var PlanetRAMAction = require('../../actions/PlanetRAMAction');
var Stores = require('../../stores/Stores');
var Constants = require('../../constants/Constants');

var Tree = require('./Tree.react');
var TreeGenerateDialog = require('./TreeGenerateDialog.react');


var GenerateTrees = React.createClass({

    propTypes: {
        data: ReactPropTypes.object
    },
    getInitialState: function(){
        return this._getDataFromStore();
    },

    componentDidMount: function(){
        Hub.subscribe(Constants.TreeEvent.TREE_ADD, this._refresh, Constants.EventPriority.VIEW);
        Hub.subscribe(Constants.TreeEvent.TREE_REMOVE, this._refresh, Constants.EventPriority.VIEW);
    },
    componentWillUnmount: function(){
        Hub.unsubscribe(Constants.TreeEvent.TREE_ADD, this._refresh, Constants.EventPriority.VIEW);
        Hub.unsubscribe(Constants.TreeEvent.TREE_REMOVE, this._refresh, Constants.EventPriority.VIEW);
    },


    onClickTree: function(id){
        var index = null;
        this.state.items.forEach(function(obj, i){
            if(obj.id == id && !index){
                index = i;
            }
        });
        PlanetRAMAction.update(this.state.items[index].value);
        TreeAction.remove(id);

    },
    updateStatisticTable: function(table){
        this.props.updateStatisticTable(table);
    },

    updateChartData: function(chart){
        this.props.updateChartData(chart);
    },

    _getDataFromStore: function(){
        var store = Stores.get(Constants.StoreType[this.props.name]);
        return {
            items: store.getAll()
        };
    },
    _refresh: function(){
        var data = this._getDataFromStore();
        this.setState(data, function(){
        });
    },
    render: function() {
        // just copy from Planet.react.js with some changes (ugly...)
        var gridColumns = {};
        var gridColumnIndex = null;
        this.state.items.forEach(function(obj, i){
            if(i === 0){
                gridColumnIndex = i;
                gridColumns[i] = [];
            }

            if(i !== 0 && i % 3 === 0){
                // we can just move gridColumnIndex above from loop and do gridColumnIndex++
                // but we are not looking for the easy way :) #justfordemo
                gridColumnIndex = Number(Object.keys(gridColumns).pop()) + 1;
                gridColumns[gridColumnIndex] = [];
            }
            gridColumns[gridColumnIndex].push(
                <td key={obj.id}>
                    <Tree onClickTree={this.onClickTree.bind(this, obj.id)}
                        value={obj.value}
                    />
                </td>
            );
        }.bind(this));

        return (
            <div className="garden">
                <Grid>
                    <Row>
                        <Col xs={3} md={3}>
                            <Panel>
                                <table>
                                    {Object.keys(gridColumns).map(function(index, i){
                                        return (
                                            <tr key={i}>
                                                {gridColumns[index]}
                                            </tr>
                                        );
                                    })}
                                </table>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
                <ModalTrigger modal={
                    <TreeGenerateDialog
                        updateStatisticTable={this.updateStatisticTable}
                        updateChartData={this.updateChartData}
                    />
                    }>
                    <Button id="bigBtn" bsStyle="success" block>ВЫРАСТИТЬ ДЕРЕВО</Button>
                </ModalTrigger>
            </div>
        );
    }
});

module.exports = GenerateTrees;
