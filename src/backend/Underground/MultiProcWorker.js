var tc = require('../timer/TimeCatch');
var sizeof = require('object-sizeof');

var CSVAnalytic = require('../csv/CSVAnalytic');
var Constants = require('../csv/CSVConstants');

// we should unpause the stdin stream because it paused by default
process.stdin.resume();

process.stdin.on('data', function (data) {
    try{
        tc.start();
        var sizeOfData = sizeof(data);

        data = data.toString();
        data = data.split(Constants.NEW_LINE_DELIMITER);
        var resultData = CSVAnalytic.processData(data);
        var json = JSON.stringify(resultData);

        tc.end('worker|' + sizeOfData);

        console.log(json);
    }catch(e){
        console.log(e);
    }

    process.exit();
});