/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    _ = require('lodash'),
    processFilterResults = require('./process-filter-results'),
    createMongoFilter = require('./create-mongo-filter'),
// filters
    exitSpeedFilter = require('../filters/exit-speed'),
    sameNetworkFilter = require('../filters/same-network');

var defaultOpts = {
        sort: 'consensus_weight_fraction',
        sortAscending: false,
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
        dbOpts = createMongoFilter(filterOpts),
        relays = collections.relays,
        bridges = collections.bridges,

        hasExitSpeedFilter = filterOpts.exitSpeed !== null,
        hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK;

    sortObj[opts.sort] = opts.sortAscending ? 1 : -1;

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