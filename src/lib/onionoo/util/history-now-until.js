var _ = require('lodash-node'),
    moment = require('moment').utc;

var defaultCfg = {
    history: {},
    timeAgo: 0,
    sourceField: '1_week',
    destField: '3_days'
};

module.exports = function(oCfg){
    var cfg = _.merge(defaultCfg, oCfg),
        history = cfg.history,
        timeAgo = cfg.timeAgo,
        source = cfg.sourceField,
        dest = cfg.destField;

    Object.keys(history).forEach(function(historyField){
        if (history[historyField][source]) {
            // get first timestamp
            var sum = 0,
                earliestValue = Infinity,
                sourceValues = history[historyField][source].values,
            // get youngest dataset from source
                now = moment(),
                timeFromComputedNowAgo = now - timeAgo,
                filteredSourceValues = sourceValues.filter(function(valuePair){
                    if (valuePair[0] > timeFromComputedNowAgo) {
                        if (valuePair[0] < earliestValue){
                            earliestValue = valuePair[0];
                        }
                        sum += valuePair[1];
                        return true;
                    }
                });

            // cut > 3 days from values array
            history[historyField][dest] = {
                first: earliestValue,
                last: now,
                values: filteredSourceValues,
                avg: sum / filteredSourceValues.length
            };
        }
    });

    return history;
};
