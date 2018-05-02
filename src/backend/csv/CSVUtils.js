var Constants = require('./CSVConstants');

module.exports = {
    chainCSVFileData: function(csvFileData, sizeOfChain){
        var chain = [], res;
        var sizeOfChain = sizeOfChain || Constants.DEFAULT_SIZE_OF_CHAIN;

        var rows = csvFileData.split(Constants.NEW_LINE_DELIMITER);
        var columnNames = rows.shift();
        var genRowsFunc = function(rows){
            this.rows = rows;
            this.lastIndex = 0;
            this.next = function(count){
                var _rows = this.rows.slice(this.lastIndex, this.lastIndex + count);
                this.lastIndex = this.lastIndex + count;
                return _rows;
            }
        };

        var generator = new genRowsFunc(rows);
        while(res = generator.next(sizeOfChain)){
            if(!res.length) break;
            chain.push([columnNames].concat(res));
        }

        return chain;
    },
    generateCSVFile: function(columnCount, rowCount, delimeter){
        var columnCount = columnCount || Constants.DEFAULT_CSV_COLUMN_COUNT;
        var rowCount = rowCount || Constants.DEFAULT_CSV_ROW_COUNT;
        var delimeter = delimeter || Constants.DEFAULT_CSV_DELIMETER;


        var randomIndexFrom0To = function(to){
            return Math.floor(Math.random() * (to+1));
        };

        var dataGenerics = {
            string: function(){
                var unicValue = 'unicvalue';
                var strings = [
                    Math.random().toString(32).substring(2),
                    unicValue,
                    Math.random().toString(32).substring(2),
                    unicValue,
                    Math.random().toString(32).substring(2),
                    unicValue,
                    Math.random().toString(32).substring(2),
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '', '', '', '', '', '', '', '', ''
                ];
                return strings[randomIndexFrom0To(strings.length)];
            },
            date: function(){
                var unicValue = '11-11-2011';
                var date = [
                    '01-02-2015',
                    unicValue,
                    '02-07-2014',
                    unicValue,
                    '08-01-2012',
                    unicValue,
                    '11-12-2010',
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '', '', '', '', '', '', '', '', ''
                ];
                return date[randomIndexFrom0To(date.length)];
            },
            number: function(){
                var unicValue = '12345678';
                var numbers = [
                    Math.random().toString(10).substring(10),
                    unicValue,
                    Math.random().toString(10).substring(10),
                    unicValue,
                    Math.random().toString(10).substring(10),
                    unicValue,
                    Math.random().toString(10).substring(10),
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '',
                    unicValue,
                    '', '', '', '', '', '', '', '', ''
                ];
                return numbers[randomIndexFrom0To(numbers.length)];
            }
        };

        var rows = [];

        var columnNamesArray = [];
        for(var j=0;j<columnCount;j++){
            var name = Object.keys(dataGenerics)[randomIndexFrom0To(2)];
            name += j + 1;
            columnNamesArray.push(name);
        }
        rows.push(columnNamesArray.join(delimeter));

        for(var i=0;i<rowCount;i++){
            var lineArray = [];
            for(var jj=0;jj<columnNamesArray.length;jj++){
                var funcName = columnNamesArray[jj];
                funcName = funcName.replace(/[0-9]/, '');
                var genericFunc = dataGenerics[funcName];
                lineArray.push(genericFunc());
            }
            rows.push(lineArray.join(delimeter));
        }

        return rows.join(Constants.NEW_LINE_DELIMITER);
    }
};