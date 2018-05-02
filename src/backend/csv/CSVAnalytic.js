var Constants = require('./CSVConstants');

module.exports = {
    processData: function(csvFileDataArray){
        var result = [];
        csvFileDataArray.forEach(function(obj, i){
            var rowValues = obj.split(Constants.DEFAULT_CSV_DELIMETER);
            if(i === 0){
                // parse column names
                rowValues.forEach(function(value){
                    result.push({
                        name: value,
                        type: null,
                        unicValues: null,
                        fillPercent: 0,
                        all: []
                    });
                });
            }else{
                rowValues.forEach(function(value, i){
                    result[i].all.push(value);
                });
            }
        });

        result.map(function(obj){
            var all = obj.all;
            var unicValues = {};
            var type = null;
            var notEmptyValues = all.filter(function(v){
                if(v){
                    if(!unicValues[v]){
                        unicValues[v] = 1;
                    }else{
                        unicValues[v] += 1;
                    }

                    /*
                     *   a little bit not cool type checking
                     *   but for demo it's ok
                     */
                    if(!type){
                        // check type only once (we think that column has the same type for all it's elements)
                        var isNumber = !isNaN(v);
                        var isDate = (function(){
                            var date = new Date(v);
                            return !isNaN(date.getDate());
                        })();

                        if(isNumber){
                            type = 'number';
                        }else if(isDate){
                            type = 'date';
                        }else{
                            type = 'string';
                        }
                    }

                    return v;
                }
            }).length;

            obj.fillPercent = notEmptyValues / all.length * 100;
            obj.unicValues = unicValues;
            obj.type = type;
            delete obj.all;

            return obj;
        });

        return result;
    },
    mergeDataResults: function(dataResults){
        var result = {};
        dataResults.forEach(function(obj){
            if(!result[obj.name]) {
                result[obj.name] = {
                    type: obj.type,
                    unicValues: [obj.unicValues],
                    fillPercent: [obj.fillPercent]
                };
            }else{
                result[obj.name].fillPercent.push(obj.fillPercent);
                result[obj.name].unicValues.push(obj.unicValues);
            }
        });

        result = Object.keys(result).map(function(key){
            var commonFillPercent = 0;
            result[key].fillPercent.forEach(function(percent){
                commonFillPercent += percent;
            });
            commonFillPercent = commonFillPercent / result[key].fillPercent.length;
            result[key].fillPercent = commonFillPercent;

            var bufferUnics = {};
            result[key].unicValues.forEach(function(unicValueArr){
                Object.keys(unicValueArr).forEach(function(key){
                    if(!bufferUnics[key]){
                        bufferUnics[key] = unicValueArr[key];
                    }else{
                        bufferUnics[key] += unicValueArr[key];
                    }
                })
            });
            result[key].unicValues = Object.keys(bufferUnics).length;

            result[key].name = key;
            return result[key];
        });

        return result;
    }
};