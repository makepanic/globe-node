var config = require('../../config'),
    historyValuesFromNowUntil = require('../historyValuesFromNowUntil');

module.exports = function(processedHistoryResponse){
    var bridges = processedHistoryResponse.bridges,
        relays = processedHistoryResponse.relays;

    // compute 3_days period from 1_week
    if (bridges && bridges.periods.length) {
        // compute bridges 3_days
        bridges.history = historyValuesFromNowUntil({
            history: bridges.history,
            timeAgo: config.DAY * 3,
            sourceField: '1_week',
            destField: '3_days'
        });
        // add 3_days to periods array
        processedHistoryResponse.bridges.periods.unshift('3_days');
    }
    if (processedHistoryResponse.relays && processedHistoryResponse.relays.periods.length) {
        // compute relays 3_days
        relays.history = historyValuesFromNowUntil({
            history: relays.history,
            timeAgo: config.DAY * 3,
            sourceField: '1_week',
            destField: '3_days'
        });
        // add 3_days to periods array
        processedHistoryResponse.relays.periods.unshift('3_days');
    }

    return processedHistoryResponse;
};