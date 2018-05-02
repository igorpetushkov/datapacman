module.exports = {
    parseLog: function(log){
        var result = {};

        var logLines = log.split(';');
        logLines.forEach(function(line){
            var arr = line.split('=');
            if(arr.length == 2){
                var nameAndMemSize = arr[0].split('|');
                var name = nameAndMemSize[0].trim();
                var memSize = parseInt(nameAndMemSize[1].trim());
                var time = parseFloat(arr[1].trim());

                if(!result[name]){
                    result[name] = {
                        memSize: memSize,
                        time: time,
                        all: []
                    }
                }else{
                    result[name].all.push({
                        time: time.toFixed(3),
                        memSize: memSize
                    });
                    time = parseFloat(result[name].time) + time;
                    result[name].time = time.toFixed(3);
                    result[name].memSize += memSize;
                }
            }
        });

        return result;
    }
};