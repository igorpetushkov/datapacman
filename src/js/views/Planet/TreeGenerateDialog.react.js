var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Well = require('react-bootstrap').Well;
var Panel = require('react-bootstrap').Panel;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;

var TreeAction = require('../../actions/TreeAction');

var AnaliticTable = require('../../utils/AnaliticTable');
var AnaliticChart = require('../../utils/AnaliticChart');

var TreeGenerateDialog = React.createClass({
    getInitialState: function(){
        return {
            file: null,
            treeValue: null,
            tableData: null
        };
    },

    _getTreeValue: function(json){
        var treeValue = 0;
        var data = JSON.parse(json);
        data.forEach(function(obj){
            treeValue += (obj.fillPercent + obj.unicValues) / 2;
        });

        treeValue += '';
        treeValue = treeValue.substring(0, 3);
        return treeValue;
    },

    genTreeInProgress: false,
    generateTree: function(){
        if(this.genTreeInProgress){
            toastr.warning('Wait please...');
            return;
        }

        $.get('/generate', function(file){
            this.setState({
                file: file
            },function(){
                var fileForHTML = file.replace(/\n/g,'<br />');
                $("#genFile").html(fileForHTML);
            });
        }.bind(this));
    },

    createTreeInProgress: false,
    createTree: function(){
        if(this.createTreeInProgress){
            toastr.warning('Wait please...');
            return;
        }

        var self = this;
        var file = document.getElementById('uploadedFile').files[0];
        if(file){
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e){
                var fileData = e.target.result;
                self._createTreeData(fileData);
            };
        }else if(this.state.file){
            self._createTreeData(this.state.file);
        }else{
            toastr.warning('Добавьте CSV файл или сгенерируйте его.');
        }
    },
    _createTreeData: function(fileData){
        var self = this;
        $.ajax({
            type: "POST",
            contentType: "text/plain",
            url: '/upload',
            data: fileData,
            dataType: "text",
            complete: function(data){
                if(data.status === 200){
                    self.setState({
                        treeValue: self._getTreeValue(data.responseText),
                        tableData: JSON.parse(data.responseText)
                    }, function(){
                        var analiticTable = AnaliticTable.create(this.state.tableData);
                        $("#genResult").html(analiticTable);

                        self.genTreeInProgress = false;
                    })
                }
            }
        });
    },

    onClickOK: function(){
        TreeAction.add(this.state.treeValue);
        this.props.updateStatisticTable(this.state.tableData);
        this.props.onRequestHide();

        this._updateChartData();
    },

    _updateChartData:function(){
        $.get('/log', function(log){
            this.props.updateChartData(AnaliticChart.parseLog(log));
        }.bind(this));
    },

    render: function() {
        return (
            <Modal {...this.props} bsStyle="primary" title="Мастерская" animation={false}>
                <div className="modal-body">
                    <Input id="uploadedFile" type="file" />
                    <hr />
                    {!this.state.file ?
                        <Button onClick={this.generateTree} bsSize="small">Сгенерировать CSV файл</Button>
                    : null}
                    <Well>
                        <div id="genFile" className="genFile"></div>
                    </Well>
                    <div id="genResult" className="genResult"></div>
                    <hr />
                    {this.state.treeValue ?
                        <div className="genTreeValue">
                            Мы вырастили дерево: <Label>{this.state.treeValue}</Label>
                        </div>
                     : null}
                </div>
                <div className="modal-footer">
                    {!this.state.treeValue ?
                        <Button onClick={this.createTree} bsStyle="primary">Создать дерево</Button>
                    :   <Button onClick={this.props.onRequestHide} bsStyle="danger">Нет. Нам такое не нужно.</Button> }
                    {this.state.treeValue ?
                        <Button onClick={this.onClickOK} bsStyle="success">ОК, Берем. Заверните в пакетик.</Button>
                    : null}
                </div>
            </Modal>
        );
    }
});

module.exports = TreeGenerateDialog;