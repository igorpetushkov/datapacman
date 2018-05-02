var MultiProcUnderground = require('./src/backend/Underground/MultiProcUnderground');
var CSVUtils = require('./src/backend/csv/CSVUtils');
var tc = require('./src/backend/timer/TimeCatch');
var sizeof = require('object-sizeof');

var constants = require('./src/backend/csv/CSVConstants');

var express = require('express');
var fs = require('fs');

// we can use express.bodyParser() but let's use this one below
var bodyParser = require('body-parser');

var JSON_TYPE = "application/json";
var PLAIN_TYPE = "text/plain";

var app = express();

app.set('views', './src/');
app.set('view engine', 'jade');

app.use('/public', express.static('./public'));

app.use(bodyParser.json({ type: JSON_TYPE }));
app.use(bodyParser.text({ type: PLAIN_TYPE }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/log', function (req, res) {
    fs.readFile('./log', "utf8", function (err, data) {
        res.send(data);
    });
});

app.get('/generate', function (req, res) {
    tc.start();
    var file = CSVUtils.generateCSVFile();
    tc.end('generate|' + sizeof(file));
    res.send(file);
});


app.post('/upload', function (req, res) {
    if (!req.body && req.is(PLAIN_TYPE)) return res.sendStatus(400);

    var limitError = false;

    var callback = function(result){
        if(!limitError) res.send(result);
    };

    if(sizeof(req.body) > constants.CSV_FILE_SIZE_LIMIT){
        req.send('Error: CSV_FILE_SIZE_LIMIT');
    }

    // ugly hack
    var cancelWorkerLimit = req.url.indexOf('cancelWorkerLimit=1') > -1;
    var setTimeLimitForFile = req.url.indexOf('setTimeLimitForFile=1') > -1;
    if(setTimeLimitForFile){
        var timeLimitForFile = 1000; // 1 second
        setTimeout(function(){
            limitError = true;
            res.send('Error: TIME_LIMIT_FOR_FILE');
        }, timeLimitForFile)
    }

    MultiProcUnderground.doIt(req.body, callback, cancelWorkerLimit);
});

var server = app.listen(9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)
});