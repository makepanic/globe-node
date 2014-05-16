var RSVP = require('rsvp'),
    _ = require('lodash');

var defaultOpts = {
        sort: 'consensus_weight_fraction',
        sortAscending: false,
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
    addToOptionIf = function (target, targetField, checkValue, assignedValue) {
        if (checkValue !== null) {
            target[targetField] = _.isFunction(assignedValue) ? assignedValue() : assignedValue;
        }
    },
    relayReduceFn = function (relay, prev) {
        prev.consensus_weight_fraction += relay.consensus_weight_fraction;
        prev.advertised_bandwidth_fraction += relay.advertised_bandwidth_fraction;
        prev.guard_probability += relay.guard_probability;
        prev.middle_probability += relay.middle_probability;
        prev.exit_probability += relay.exit_probability;
        prev.fingerprints.push(relay);
    };

module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        sortObj = {},
        dbOpts = {},
        relays = collections.relays,
        bridges = collections.bridges,
        initialOps = {
            consensus_weight_fraction: 0,
            advertised_bandwidth_fraction: 0,
            guard_probability: 0,
            middle_probability: 0,
            exit_probability: 0,
            fingerprints: []
        };

    sortObj[opts.sort] = opts.sortAscending ? 1 : -1;

    if (filterOpts.inactive === null || filterOpts.inactive === false) {
        // only running
        dbOpts.running = true;
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

    // use dbOpts for collection.mapReduce {option.query}
    // http://docs.mongodb.org/manual/reference/method/db.collection.mapReduce/

    return RSVP.hash({
        relays: RSVP.denodeify(relays.group.bind(relays))(
            // keys
            ['country'],
            // condition
            dbOpts,
            // initial object
            initialOps,
            // reduce func
            relayReduceFn)
    });
};