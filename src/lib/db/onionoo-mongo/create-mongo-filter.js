/* eslint camelcase:0 */

var speeds = require('./speeds'),
    _ = require('lodash');

var addToOptionIf = function (target, targetField, checkValue, assignedValue) {
    if (checkValue !== undefined && checkValue !== null) {
        target[targetField] = _.isFunction(assignedValue) ? assignedValue() : assignedValue;
    }
};

module.exports = function (filterOptions) {
    var dbFilterOptions = {},
        hasExitSpeedFilter = filterOptions.exitSpeed !== null,
        notFaster = hasExitSpeedFilter && filterOptions.exitSpeed.NOT_FASTER;
//        hasSameNetworkFilter = hasExitSpeedFilter && filterOptions.exitSpeed.MAX_PER_NETWORK;

    if (filterOptions.inactive === null || filterOptions.inactive === false) {
        // only running
        dbFilterOptions.running = true;
    }

    // apply exit speed filters
    if (hasExitSpeedFilter) {
        if (notFaster) {
            dbFilterOptions.bandwidth_rate = {
                $gt: filterOptions.exitSpeed.BANDWIDTH_RATE,
                $lt: speeds.FAST_EXIT.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbFilterOptions.advertised_bandwidth = {
                $gt: filterOptions.exitSpeed.ADVERTISED_BANDWIDTH,
                $lt: speeds.FAST_EXIT.ADVERTISED_BANDWIDTH
            };
        } else {
            // bandwidth_rate filter
            dbFilterOptions.bandwidth_rate = {
                $gt: filterOptions.exitSpeed.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbFilterOptions.advertised_bandwidth = {
                $gt: filterOptions.exitSpeed.ADVERTISED_BANDWIDTH
            };

        }
    }

    addToOptionIf(dbFilterOptions, 'guard_probability', filterOptions.guards, { $gt: 0 });
    addToOptionIf(dbFilterOptions, 'exit_probability', filterOptions.exit, { $gt: 0 });
    addToOptionIf(dbFilterOptions, 'as_number', filterOptions.as, filterOptions.as);
    addToOptionIf(dbFilterOptions, 'country', filterOptions.country, filterOptions.country);
    addToOptionIf(dbFilterOptions, 'family', filterOptions.family, function () {
        return '$' + filterOptions.family.toUpperCase();
    });

    return dbFilterOptions;
};