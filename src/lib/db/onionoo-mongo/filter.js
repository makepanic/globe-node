/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    logger = require('../../../../logger'),
    connection = require('../connection'),
    _ = require('lodash-node'),
    getSortType = require('../../util/get-sort-type'),
    processFilterResults = require('./process-filter-results'),
    createMongoFilter = require('./create-mongo-filter'),
    isFingerprint = require('../../onionoo/util/is-fingerprint'),
    hashFingerprint = require('../../onionoo/util/hash-fingerprint'),
// filters
    speeds = require('./speeds'),
    exitSpeedFilter = require('../filters/exit-speed'),
    sameNetworkFilter = require('../filters/same-network'),
    createSortFn = require('../../util/create-sort-fn');

var returnEmptyArray = function () { return []; },
    defaultOpts = {
        sortBy: 'consensus_weight_fraction',
        sortAsc: false,
        displayAmount: 10,
        wasHashed: false,
        filter: {
            os: null,
            exitSpeed: null,
            running: null,
            guards: null,
            exit: null,
            family: null,
            as: null,
            country: null,
            speed: null
        }
    };
/**
 * Calls mongodb filter
 * @throws throws an error if the database is locked
 * @param {Object} collections Mongodb collection
 * @param {Object} methodOpts Options for the filter method
 * @return {rsvp$umd$$RSVP.Promise} Promise that resolves with filtered result
 */
module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        filterPromise,
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

    if (!opts.wasHashed && filterOpts.query && filterOpts.query.length && isFingerprint(filterOpts.query)) {
        filterOpts.query = hashFingerprint(filterOpts.query);
    }

    dbOpts = createMongoFilter(filterOpts);

    hasExitSpeedFilter = filterOpts.exitSpeed !== null;
    hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK;

    // prepare cursors
    var relaysCursor = relays.find(dbOpts).sort(sortObj),
        bridgeCursor = bridges.find(dbOpts).sort(sortObj),
    // create query promises
        relayFilterFn = RSVP.denodeify(relaysCursor.toArray.bind(relaysCursor)),
        bridgeFilterFn = RSVP.denodeify(bridgeCursor.toArray.bind(bridgeCursor));

    if (typeof filterOpts.type === 'string') {
        // has filter type specified
        switch (filterOpts.type) {
            case 'relay':
                // relay filter, replace bridge filter function
                bridgeFilterFn = returnEmptyArray;
                break;
            case 'bridge':
                // bridge filter, replace relay filter function
                relayFilterFn = returnEmptyArray;
                break;
        }
    }

    if (connection.isLocked()) {
        filterPromise = new RSVP.Promise(function (resolve, reject) {
            reject({dbLocked: true});
        });
    } else {
        filterPromise = RSVP.hash({
            relays: relayFilterFn(),
            bridges: bridgeFilterFn()
        }).then(function (results) {
            // manually filtering :(
            var filteredRelays = results.relays,
                informHashFingerprint = false,
                correctSearchUrl = '';

            if (hasExitSpeedFilter) {
                filteredRelays = exitSpeedFilter(filteredRelays, filterOpts.exitSpeed.PORTS);
            }

            if (hasSameNetworkFilter) {
                filteredRelays = sameNetworkFilter(filteredRelays, filterOpts.exitSpeed.MAX_PER_NETWORK);
            }

            // detect if user searched using a non hashed bridge fingerprint
            if (opts.wasHashed &&
                results.bridges.length === 1 &&
                results.relays.length === 0 &&
                results.bridges[0].hashed_fingerprint === filterOpts.query) {
                informHashFingerprint = true;
                correctSearchUrl = '/search?query=' + results.bridges[0].hashed_hashed_fingerprint;
            }

            return processFilterResults({
                sortFn: sortFn,
                displayLimit: opts.displayAmount,
                relays: filteredRelays,
                bridges: results.bridges
            }).then(function (processedResults) {
                processedResults.uiFlags = {
                    informHashFingerprint: informHashFingerprint,
                    informEmptySortNotRunning: opts.filter.running === false &&
                        (   opts.sortBy === 'consensus_weight_fraction' ||
                            opts.sortBy === 'advertised_bandwidth_fraction' ||
                            opts.sortBy === 'guard_probability' ||
                            opts.sortBy === 'middle_probability' ||
                            opts.sortBy === 'exit_probability' )
                };
                if (informHashFingerprint) {
                    processedResults.correctSearchUrl = correctSearchUrl;
                }

                return processedResults;
            });
        });
    }
    return filterPromise;
};
