var fs = require('fs');

var LOG_FILE_PATH = './log';

var log = function(text){
    fs.appendFileSync(LOG_FILE_PATH, text);
};

module.exports = {
    start: function(){
        this.hrstart = process.hrtime();
    },
    end: function(label){
        var hrend = process.hrtime(this.hrstart);
        hrend = hrend[0] + "." + hrend[1] + "s" + ';\n';
        log(label + ' = ' + hrend);
        return hrend;
    }
};