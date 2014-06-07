/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    _ = require('lodash'),
    getSortType = require('../../util/get-sort-type'),
    processFilterResults = require('./process-filter-results'),
    createMongoFilter = require('./create-mongo-filter'),
// filters
    speeds = require('./speeds'),
    exitSpeedFilter = require('../filters/exit-speed'),
    sameNetworkFilter = require('../filters/same-network'),
    createSortFn = require('../../util/create-sort-fn');

var defaultOpts = {
    sortBy: 'consensus_weight_fraction',
    sortAsc: false,
    displayAmount: 10,
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
};

module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        sortObj = {},
        relays = collections.relays,
        bridges = collections.bridges,
        hasExitSpeedFilter,
        hasSameNetworkFilter,
        dbOpts,
        sortFnType = getSortType(opts.sortBy),
        sortFn = (createSortFn[sortFnType] ? createSortFn[sortFnType] : createSortFn.numeric)(opts.sortBy, opts.sortAsc);

    sortObj[opts.sortBy] = opts.sortAsc ? 1 : -1;

    if (filterOpts.exitSpeed) {
        // get exitSpeed object for given string
        filterOpts.exitSpeed = speeds[filterOpts.exitSpeed];
    }

    dbOpts = createMongoFilter(filterOpts);
    hasExitSpeedFilter = filterOpts.exitSpeed !== null;
    hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK;

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
            sortFn: sortFn,
            displayLimit: opts.displayAmount,
            relays: filteredRelays,
            bridges: []
        }).then(function (processedResults) {
            // TODO: add flags if special UI is needed
            processedResults.uiFlags = {};

            return processedResults;
        });

    });
};