var spawn = require('child_process').spawn;
var CSVUtils = require('../csv/CSVUtils');
var CSVAnalytic = require('../csv/CSVAnalytic');
var Constants = require('../csv/CSVConstants');

var workerPATH = './src/backend/Underground/MultiProcWorker';

module.exports = {
    doIt: function(file, callback, cancelWorkerLimit){
        var results = [], lastWorkerPID;

        // here we are using function wrapper for creating our workers
        // to avoid scoping problem (we create separated scope for each worker)
        var create_worker = function(data){
            var worker = spawn('node', [workerPATH]);

            data = data.join(Constants.NEW_LINE_DELIMITER);
            worker.stdin.write(data);

            worker.stdout.on('data', function(resultFromWorker) {
                try{
                    resultFromWorker =  resultFromWorker.toString();
                    resultFromWorker = JSON.parse(resultFromWorker);
                    results = results.concat(resultFromWorker);
                    if(worker.pid === lastWorkerPID){
                        var finalRes = CSVAnalytic.mergeDataResults(results);
                        callback(finalRes);
                    }
                } catch(e){
                    // callback error
                }
            });
            worker.stderr.on('data', function(error){});
            worker.on('close', function(code){});

            return worker.pid;
        };

        var chainData = CSVUtils.chainCSVFileData(file);
        if(!cancelWorkerLimit && chainData.length > Constants.CSV_WORKER_MAX){
            callback('Error: CSV_WORKER_MAX');
        }
        for(var i=0;i<chainData.length;i++){
            lastWorkerPID = create_worker(chainData[i]);
        }
    }
};