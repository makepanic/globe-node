var utcDiff = require('./utcDiff');

module.exports = function(value, type){
    // if not a valid length return empty data message
    if (value.length !== 19) {
        return [''];
    }

    var beforeUnit = '<span>',
        afterUnit = '</span>';

    var diff = utcDiff(value),
        units = [diff.d, diff.h, diff.m, diff.s],
        digits = 0,
        shortVersion = type === 'short',
        pluralize = !shortVersion,
        labels = shortVersion ? ['d', 'h', 'm', 's'] : ['day', 'hour', 'minute', 'second'],
        uptimeArray = [];

    for(var i = 0, max = units.length; i < max; i++){
        if(labels[i] && labels[i].length && units[i] > 0){
            digits += 1;
            uptimeArray[i] = units[i] + beforeUnit + (pluralize && units[i] > 1 ? labels[i] + 's' : labels[i]) + afterUnit;

            if(digits > 1){
                break;
            }
        }else{
            labels[i] = '';
        }
    }

    return uptimeArray;
};