/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    logger = require('../../../../logger'),
    connection = require('../connection'),
    _ = require('lodash-node'),
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

    return new RSVP.Promise(function (resolve, reject) {
        var relayFilterFn = RSVP.denodeify(
                relays
                    .find(dbOpts)
                    .sort(sortObj)
                    .toArray.bind(relays)),
            bridgeFilterFn = RSVP.denodeify(
                bridges
                    .find(dbOpts)
                    .sort(sortObj)
                    .toArray.bind(bridges));

        if (typeof filterOpts.type === 'string') {
            // has filter type specified
            var returnEmptyArray = function () {
                return [];
            };
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
            reject({
                dbLocked: true
            });
        } else {
            resolve(RSVP.hash({
                relays: relayFilterFn(),
                bridges: bridgeFilterFn()
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
                    bridges: results.bridges
                }).then(function (processedResults) {
                    // TODO: add flags if special UI is needed
                    processedResults.uiFlags = {};
                    return processedResults;
                }).catch(function (err) {
                    logger.error(err.message);
                    reject(err);
                });

            }, function (err) {
                logger.err('filter', err);
                reject(err);
            }));
        }
    });
};
