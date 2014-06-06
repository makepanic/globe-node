/*eslint camelcase:0, no-space-before-semi: 0 */

var RSVP = require('rsvp'),
    logger = require('../../../../logger'),
    getSortType = require('../../util/get-sort-type'),
    processGroupResults = require('./process-group-results'),
    createMongoFilter = require('./create-mongo-filter'),
    countArrayUniques = require('../../util/count-array-uniques'),
    _ = require('lodash-node'),
// filters
    exitSpeedFilter = require('../filters/exit-speed'),
    sameNetworkFilter = require('../filters/same-network'),
    createSortFn = require('../../util/create-sort-fn');

var defaultOpts = {
        sortBy: 'consensus_weight_fraction',
        sortAsc: false,
        displayAmount: 10,
        group: {},
        filter: {
            exitSpeed: null,
            running: null,
            guards: null,
            exit: null,
            family: null,
            as: null,
            country: null,
            speed: null
        }
    },
    countItemsToObject = function (arr) {
        return countArrayUniques(arr);
//        var obj = new Map();
//        arr.forEach(function (item) {
//            obj.set(item, obj.has(item) ? obj.get(item) + 1 : 1);
//        });
//        return obj;
    },
    /**
     * Function that is used in the mongodb aggregation framework data to convert all relays to the expected format.
     * The reason we need to do this manually is that the aggregation framework can't group array values to an object
     * that contains the array value and the amount of duplicated array values in the array.
     * @param {Object} relay Relay to convert
     * @param {boolean} isGroupFamily True if the beforecheck is used with group family
     * @return {Object} Converted relay
     */
    beforeCheck = function (relay, isGroupFamily) {
        relay.as_name = countItemsToObject(relay.as_name);
        relay.as_number = countItemsToObject(relay.as_number);
        relay.country = countItemsToObject(relay.country);
        relay.contact = countItemsToObject(relay.contact);
        relay.tor = countItemsToObject(relay.tor);
        relay.os = countItemsToObject(relay.os);
        relay.family = countItemsToObject(isGroupFamily ? relay.family : _.flatten(relay.family));
        return relay;
    };


module.exports = function (collections, methodOpts) {
//    var startHrtime = process.hrtime();

    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        groupFields = {},
        aggregatePromise,
        aggregatePipe = [],

        hasExitSpeedFilter = filterOpts.exitSpeed !== null,
        hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK,

        hasGroupCountry = opts.group.country,
        hasGroupAS = opts.group.as,
        hasGroupContact = opts.group.contact,
        hasGroupFamily = opts.group.family,
        hasGroupAnything = hasGroupAS || hasGroupContact || hasGroupCountry || hasGroupFamily,

        sortObj = {},
        dbOpts = createMongoFilter(filterOpts),
        relays = collections.relays,
        sortFnType = getSortType(opts.sortBy),
        sortFn = (createSortFn[sortFnType] ? createSortFn[sortFnType] : createSortFn.numeric)(opts.sortBy, opts.sortAsc);

    // change sort functions for some special cases
    switch (opts.sortBy) {
        case 'os':
            if (hasGroupAnything) {
                sortFn = createSortFn.arrayLength('os', opts.sortAsc);
            }
            break;
        case 'tor':
            if (hasGroupAnything) {
                sortFn = createSortFn.arrayLength('tor', opts.sortAsc);
            }
            break;
        case 'family':
            if (hasGroupFamily) {
                sortFn = createSortFn.firstArrayEntry('family', opts.sortAsc);
            } else {
                sortFn = createSortFn.arrayLength('family', opts.sortAsc);
            }
            break;
        case 'contact':
            if (hasGroupContact) {
                sortFn = createSortFn.firstArrayEntry('contact', opts.sortAsc);
            } else {
                sortFn = createSortFn.arrayLength('contact', opts.sortAsc);
            }
            break;
        case 'country':
            if (hasGroupCountry) {
                sortFn = createSortFn.firstArrayEntry('country', opts.sortAsc);
            } else {
                sortFn = createSortFn.arrayLength('country', opts.sortAsc);
            }
            break;
        case 'fingerprint':
            if (hasGroupAnything) {
                sortFn = createSortFn.arrayLength('fingerprints', opts.sortAsc);
            }
            break;
        case 'as_number':
            if (hasGroupAS) {
                sortFn = createSortFn.firstArrayEntry('as_number', opts.sortAsc);
            } else {
                sortFn = createSortFn.arrayLength('as_number', opts.sortAsc);
            }
            break;
    }

    if (hasGroupAS) {
        groupFields.as_number = '$as_number';
    }
    if (hasGroupCountry) {
        groupFields.country = '$country';
    }
    if (hasGroupContact) {
        groupFields.contact = '$contact';
    }
    if (hasGroupFamily) {
        groupFields.family = '$family';
    }

    // convert sortAsc truthy to mongodb sort direction
    sortObj[opts.sortBy] = opts.sortAsc ? 1 : -1;

    // build the aggregate pipeline
    // match via filter options
    aggregatePipe.push({$match: dbOpts});

    if (hasGroupFamily) {
        // if group by family, unwind family array
        aggregatePipe.push({$unwind: '$family'});
    }

    // add group aggregation
    aggregatePipe.push({
        $group: {
            _id: groupFields,
//            fingerprints: { $push: '$$ROOT' },
            fingerprints: {$push: '$fingerprint'},
            consensus_weight_fraction: {$sum: '$consensus_weight_fraction'},
            advertised_bandwidth_fraction: {$sum: '$advertised_bandwidth_fraction'},
            guard_probability: {$sum: '$guard_probability'},
            middle_probability: {$sum: '$middle_probability'},
            exit_probability: {$sum: '$exit_probability'},
            as_number: { $push: '$as_number' },
            as_name: { $push: '$as_name' },
            country: { $push: '$country' },
            contact: { $push: '$contact' },
            tor: { $push: '$tor' },
            os: { $push: '$os' },
            family: {$push: '$family'}
        }
    });

    // create promise that aggregates using created pipeline
    aggregatePromise = new RSVP.Promise(function (resolve) {
        var resultData = [],
            cursor = relays.aggregate(aggregatePipe, {
                cursor: {batchSize: 1000}
            });
        cursor.on('data', function (data) {
            resultData.push(beforeCheck(data, hasGroupFamily));
        });
        cursor.on('end', function () {
            resolve({
                relays: resultData
            });
        });
    }).then(function (results) {
            // manually filtering :(
            var filteredRelays = results.relays;

            if (hasExitSpeedFilter) {
                filteredRelays = exitSpeedFilter(filteredRelays, filterOpts.exitSpeed.PORTS);
            }

            if (hasSameNetworkFilter) {
                filteredRelays = sameNetworkFilter(filteredRelays, filterOpts.exitSpeed.MAX_PER_NETWORK);
            }

            return processGroupResults({
                sortFn: sortFn,
                displayLimit: opts.displayAmount,
                relays: filteredRelays,
                bridges: []
            }).then(function (processedResults) {
//                var diff = process.hrtime(startHrtime);
//                logger.info('group took %d nanoseconds', diff[0] * 1e9 + diff[1]);

                processedResults.uiFlags = {
                    hasGroupCountry: hasGroupCountry,
                    hasGroupAS: hasGroupAS,
                    hasGroupContact: hasGroupContact,
                    hasGroupFamily: hasGroupFamily
                };
                return processedResults;
            });
        });

    return aggregatePromise;
};
