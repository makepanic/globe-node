var consts = require('../../static');

module.exports = function(graphData, field){
    var periodsObject = {},
        uniquePeriods = [];

    Object.keys(graphData).forEach(function(data){
        var historyPeriods = graphData[data][field].periods;
        historyPeriods.forEach(function(history){
            periodsObject[history] = 1;
        });
    });

    Object.keys(periodsObject).forEach(function(periodKey){
        uniquePeriods.push({
            key: periodKey,
            title: consts.messages[periodKey],
            pos: consts.numbers[periodKey]
        })
    });

    uniquePeriods = uniquePeriods.sort(function(a, b){
        return a.pos - b.pos;
    });

    return uniquePeriods;
};