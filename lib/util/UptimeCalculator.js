var utcDiff = require('./utcDiff'),
    _ = require('lodash');

module.exports = function(value, type){
    // if not a valid value return empty data
    if (!(_.isString(value) && value.length === 19)) {
        return [];
    }

    var beforeLabel = '<span>',
        afterLabel = '</span>';

    var diff = utcDiff(value),
        units = [diff.d, diff.h, diff.m, diff.s],
        shortVersion = type === 'short',
        pluralize = !shortVersion,
        labels = shortVersion ? ['d', 'h', 'm', 's'] : ['day', 'hour', 'minute', 'second'],
        uptimeArray = [];

    units.every(function(unit, index){
        var isDone = false,
            label = labels[index];

        if(unit > 0) {
            // push unit with label to result array
            uptimeArray.push(unit + beforeLabel + (pluralize && unit > 1 ? label + 's' : label) + afterLabel);

            if(uptimeArray.length > 1) {
                // stop if more than 2 time values exist
                isDone = true;
            }
        }
        return !isDone;
    });

    return uptimeArray;
};