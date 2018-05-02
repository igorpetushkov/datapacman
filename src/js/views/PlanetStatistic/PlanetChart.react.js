var React = require('react');

var PlanetChart = React.createClass({
    propTypes: {},
    mixins : [],

    getDefaultProps: function() {
        return {
            chartData: null
        }
    },

    componentWillReceiveProps: function(newProps){
        var chartData = newProps.chartData;
        this._renderFirstChart(chartData);
        this._renderSecondChart(chartData);
    },

    _renderFirstChart: function(chartData){
        if(chartData){
            var labels = [];
            var series1 = [];
            var series2 = [];

            var workerDatas1 = chartData['worker']['all'].splice(0, 30);
            workerDatas1.forEach(function(data, i){
                labels.push(i);
                series1.push(parseFloat(data.time) * 60); // millsec
            });

            var workerDatas2 = chartData['worker']['all'].splice(30, 60);
            workerDatas2.forEach(function(data, i){
                series2.push(parseFloat(data.time) * 60); // millsec
            });

            var data = {
                labels: labels,
                series: [series1, series2]
            };

            new Chartist.Line('#chart1', data);
        }
    },

    _renderSecondChart: function(chartData){
        if(chartData){
            var labels = [];
            var series = [];

            var genData = chartData['generate']['all'].splice(0, 30);
            genData.forEach(function(data, i){
                labels.push(i);
                series.push(data.memSize);
            });

            var data = {
                labels: labels,
                series: [series]
            };

            new Chartist.Bar('#chart2', data);
        }
    },

    render: function(){
        return (
            <div className="statisticChart">
                <div id="chart1" className="ct-chart ct-perfect-fourth"></div>
                <div id="chart2" className="ct-chart ct-perfect-fourth"></div>
            </div>
        );
    }
});

module.exports = PlanetChart;
