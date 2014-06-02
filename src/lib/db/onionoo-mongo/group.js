/*eslint camelcase:0, no-console:0 */

var RSVP = require('rsvp'),
    getSortType = require('../../util/get-sort-type'),
    processGroupResults = require('./process-group-results'),
    createMongoFilter = require('./create-mongo-filter'),
    _ = require('lodash'),
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
            inactive: null,
            guards: null,
            exit: null,
            family: null,
            as: null,
            country: null,
            speed: null
        }
    },
    relayReduceFn = function (relay, prev) {
        prev.consensus_weight_fraction += relay.consensus_weight_fraction;
        prev.advertised_bandwidth_fraction += relay.advertised_bandwidth_fraction;
        prev.guard_probability += relay.guard_probability;
        prev.middle_probability += relay.middle_probability;
        prev.exit_probability += relay.exit_probability;
        prev.fingerprints.push(relay);
        prev.as_number[relay.as_number] = prev.as_number[relay.as_number] ? prev.as_number[relay.as_number] + 1 : 1;
        prev.as_name[relay.as_name] = prev.as_name[relay.as_name] ? prev.as_name[relay.as_name] + 1 : 1;
        prev.country[relay.country] = prev.country[relay.country] ? prev.country[relay.country] + 1 : 1;
    };

module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        groupFields = [],

        hasExitSpeedFilter = filterOpts.exitSpeed !== null,
        hasSameNetworkFilter = hasExitSpeedFilter && filterOpts.exitSpeed.MAX_PER_NETWORK,

        hasGroupCountry = opts.group.country,
        hasGroupAS = opts.group.as,
        hasGroupContact = opts.group.contact,

        sortObj = {},
        dbOpts = createMongoFilter(filterOpts),
        relays = collections.relays,
        sortFnType = getSortType(opts.sortBy),
        sortFn = (createSortFn[sortFnType] ? createSortFn[sortFnType] : createSortFn.numeric)(opts.sortBy, opts.sortAsc),

        //bridges = collections.bridges,
        initialOps = {
            consensus_weight_fraction: 0,
            advertised_bandwidth_fraction: 0,
            guard_probability: 0,
            middle_probability: 0,
            exit_probability: 0,
            country: {},
            as_number: {},
            as_name: {},
            fingerprints: []
        };

    // group sort functions are special because they have a different structure
    switch(opts.sortBy) {
        case 'country':
            if (hasGroupCountry && hasGroupAS || hasGroupCountry) {
                sortFn = createSortFn.firstObjectKeyString('country', opts.sortAsc);
            } else if (hasGroupAS) {
                sortFn = createSortFn.objectKeysLength('country', opts.sortAsc);
            }
            break;
        case 'fingerprint':
            if (hasGroupCountry || hasGroupAS) {
                sortFn = createSortFn.arrayLength('fingerprints', opts.sortAsc);
            }
            break;
        case 'as_number':
            if (hasGroupAS || hasGroupAS && hasGroupCountry) {
                sortFn = createSortFn.firstObjectKeyString('as_number', opts.sortAsc);
            } else if (hasGroupCountry) {
                sortFn = createSortFn.objectKeysLength('as_number', opts.sortAsc);
            }
            break;
    }

    if (hasGroupCountry) {
        groupFields.push('country');
    }
    if (hasGroupAS) {
        groupFields.push('as_number');
    }
    if (hasGroupContact) {
        groupFields.push('contact');
    }

    sortObj[opts.sortBy] = opts.sortAsc ? 1 : -1;

    console.log('opts', opts);
    console.log('sorting', sortObj);
    console.log('filtering', dbOpts);

    return RSVP.hash({
        relays: RSVP.denodeify(relays.group.bind(relays))(
            // keys
            groupFields,
            // condition
            dbOpts,
            // initial object
            initialOps,
            // reduce func
            relayReduceFn)
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
            processedResults.uiFlags = {
                hasCountryFlags: hasGroupCountry,
                hasOneASNumber: hasGroupAS
            };
            return processedResults;
        });
    });
};