/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    _ = require('lodash'),
    speeds = require('./speeds'),
    processFilterResults = require('./process-filter-results'),
// filters
    exitSpeedFilter = require('../filters/exit-speed'),
    sameNetworkFilter = require('../filters/same-network');

var defaultOpts = {
        sort: 'consensus_weight_fraction',
        sortAscending: false,
        filter: {
            exitSpeed: null,
            inactive: null,
            guards: null,
            exit: null,
            family: null,
            as: null,
            country: null,
            speed: null
        }
    },
    addToOptionIf = function (target, targetField, checkValue, assignedValue) {
        if (checkValue !== undefined && checkValue !== null) {
            target[targetField] = _.isFunction(assignedValue) ? assignedValue() : assignedValue;
        }
    };

module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        sortObj = {},
        dbOpts = {},
        relays = collections.relays,
        bridges = collections.bridges,

        hasExitSpeedFilter = filterOpts.exitSpeed !== null,
        notFaster = hasExitSpeedFilter && filterOpts.exitSpeed.NOT_FASTER,
        hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK;

    sortObj[opts.sort] = opts.sortAscending ? 1 : -1;

    // first apply filters that mongodb can use to filter its query result

    if (filterOpts.inactive === null || filterOpts.inactive === false) {
        // only running
        dbOpts.running = true;
    }

    // apply exit speed filters
    if (hasExitSpeedFilter) {
        if (notFaster) {
            dbOpts.bandwidth_rate = {
                $gt: filterOpts.exitSpeed.BANDWIDTH_RATE,
                $lt: speeds.FAST_EXIT.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbOpts.advertised_bandwidth = {
                $gt: filterOpts.exitSpeed.ADVERTISED_BANDWIDTH,
                $lt: speeds.FAST_EXIT.ADVERTISED_BANDWIDTH
            };
        } else {
            // bandwidth_rate filter
            dbOpts.bandwidth_rate = {
                $gt: filterOpts.exitSpeed.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbOpts.advertised_bandwidth = {
                $gt: filterOpts.exitSpeed.ADVERTISED_BANDWIDTH
            };

        }
    }

    addToOptionIf(dbOpts, 'guard_probability', filterOpts.guards, { $gt: 0 });
    addToOptionIf(dbOpts, 'exit_probability', filterOpts.exit, { $gt: 0 });
    addToOptionIf(dbOpts, 'as_number', filterOpts.as, filterOpts.as);
    addToOptionIf(dbOpts, 'country', filterOpts.country, filterOpts.country);
    addToOptionIf(dbOpts, 'family', filterOpts.family, function () {
        return '$' + filterOpts.family.toUpperCase();
    });

    console.log('sorting', sortObj);
    console.log('filtering', dbOpts);

    return RSVP.hash({
        relays: RSVP.denodeify(relays
            .find(dbOpts)
            .sort(sortObj)
            .toArray.bind(relays))(),
        bridges: RSVP.denodeify(bridges
            .find(dbOpts)
            .sort(sortObj)
            .toArray.bind(bridges))()
    }).then(function (results) {
        // manually filtering :(
        var filteredRelays = results.relays;

        if (hasExitSpeedFilter) {
            filteredRelays = exitSpeedFilter(filteredRelays, filterOpts.exitSpeed.PORTS);
        }

        if (hasSameNetworkFilter) {
            filteredRelays = sameNetworkFilter(filteredRelays, filterOpts.exitSpeed.MAX_PER_NETWORK);
        }

        return processFilterResults({
            displayLimit: 10,
            relays: filteredRelays,
            bridges: []
        });
    });
};