var consts = require('../../static');

/**
 * Function that computes an array of unique graph periods
 * from a onionoo graph document request.
 * @param {Object} graphData Onionoo history document result
 * @param {String} field "bridges" or "relays"
 * @return {Array} Array of unique periods
 */
module.exports = function(graphData, field){
    var periodsObject = {},
        uniquePeriods = [];

    Object.keys(graphData).forEach(function(data){
        var graphItem = graphData[data][field],
            historyData = graphItem.history;

        Object.keys(historyData).forEach(function(historyItemKey){
            var historyItem = historyData[historyItemKey];

            // loop through periods
            Object.keys(historyItem).forEach(function(periodKey){
                if (!periodsObject[periodKey]){
                    periodsObject[periodKey] = {
                        avg: {}
                    };
                }
                // populate avg values for each period
                periodsObject[periodKey].avg[historyItemKey] = historyItem[periodKey].avg;
            });
        });
    });

    Object.keys(periodsObject).forEach(function(periodKey){
        uniquePeriods.push({
            key: periodKey,
            title: consts.messages[periodKey],
            pos: consts.numbers[periodKey],
            avg: periodsObject[periodKey].avg
        });
    });

    return uniquePeriods.sort(function(a, b){
        return b.pos - a.pos;
    });
};
