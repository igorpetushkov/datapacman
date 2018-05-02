var React = require('react');

var Panel = require('react-bootstrap').Panel;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;
var Button = require('react-bootstrap').Button;

var Constants = require('../constants/Constants');
var Planet = require('./Planet/Planet.react');
var PlanetChart = require('./PlanetStatistic/PlanetStatisticTable.react.js');
var TreeGarden = require('./Planet/TreeGarden.react.js');
var PlanetStatisticTable = require('./PlanetStatistic/PlanetStatisticTable.react');
var PlanetChart = require('./PlanetStatistic/PlanetChart.react');


var DataPacmanApp = React.createClass({
    getInitialState: function(){
        return {
            statisticTableData: [],
            chartData: null
        };
    },
    updateStatisticTable: function(tableData){
        tableData = this.state.statisticTableData.concat(tableData);
        this.setState({
            statisticTableData: tableData
        }, function(){
            toastr.success('Таблица статистики обновлена.');
        })
    },
    updateChartData: function(chartData){
        this.setState({
            chartData: chartData
        }, function(){
            toastr.success('График статистики обновлен.');
        })
    },
    render: function() {
        var planetTitle = (<h3>Планета</h3>);

        return (
            <div className="datapacman">
                <Well>
                    <h4><b>Спасите планету!</b></h4>
                    <p>
                        Правила очень простые.
                    </p>
                    <p>
                        Есть планета, которая заражена клетками с отрицательными числами.
                    </p>
                    <p>
                        Чтобы спасти планету, нужно вырастить необходимое количество деревьев и посадить их на планете.
                    </p>
                    <p>
                        Чтобы создать дерево, нужно либо загрузить CSV файл. Пожалуйста, используйте вот этот&nbsp;
                        <a target="_blank" href="https://raw.githubusercontent.com/northelks/datapacman/master/csv_example.txt">
                            пример
                        </a>
                        &nbsp;файла. Его можно сгенерировать.
                    </p>
                    <p>
                        Когда дерево создано, кликнете по зараженному место на планете. Сюда мы посадим наше дерево.
                    </p>
                    <p>
                        Затем кликните по дереву.
                    </p>
                    <p>
                        Ах да, чуть ниже можно будет увидеть таблицу со статистикой.
                    </p>
                    <p>
                        И графики. Первый показывает работу рабочих (workers), которые запускались параллельно на бэкенде.
                        Второй показывает память, затраченную на генерацию файлов.
                    </p>
                    <p>
                       Дерзайте! :)
                    </p>
                </Well>
                <div className="center">
                    <Grid>
                        <Row>
                            <Col xs={3} md={3}>
                                <Panel header={planetTitle}>
                                    <Planet name={Constants.PlanetName.RAM} />
                                </Panel>
                            </Col>
                            <Col xs={3} md={3}>
                                <TreeGarden name={Constants.TreeName.TREE}
                                            updateStatisticTable={this.updateStatisticTable}
                                            updateChartData={this.updateChartData} />
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <Grid className="charts">
                    <Row>
                        <Col xs={11} md={11}>
                            <Panel>
                                <PlanetStatisticTable tableData={this.state.statisticTableData} />
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={11} md={11}>
                            <Panel>
                                <PlanetChart chartData={this.state.chartData}/>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
});

module.exports = DataPacmanApp;
