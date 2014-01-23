var _ = require('lodash'),
    defaults = require('../onionoo/defaults'),
    buildTimeValuePairs = require('../util/buildTimeValuePairs');

module.exports = function(history, toBuild){
    var periods = [];
    for (var build in toBuild) {
        if(toBuild.hasOwnProperty(build)){

            var buildHistory = toBuild[build];
            for (var buildKey in buildHistory) {

                if (buildHistory.hasOwnProperty(buildKey)) {

                    // push buildKey to periods if not already set
                    if (periods.indexOf(buildKey) === -1) {
                        periods.push(buildKey);
                    }

                    var keyObj = _.merge({}, defaults.weightHistory, buildHistory[buildKey]);
                    history[build][buildKey] = buildTimeValuePairs(keyObj);
                }
            }
        }
    }
    return periods;
};