var React = require('react');

var AnaliticTable = require('../../utils/AnaliticTable');

var PlanetChart = React.createClass({
    propTypes: {},
    mixins : [],

    getDefaultProps: function() {
        return {
            tableData: null
        }
    },

    componentWillReceiveProps: function(newProps){
        var table = AnaliticTable.create(newProps.tableData);
        $("#statisticTable").html(table);
    },

    render: function(){
        return (
            <div id="statisticTable" className="statisticTable"></div>
        );
    }
});

module.exports = PlanetChart;
