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
    };

module.exports = function (collections, methodOpts) {
    var opts = _.merge({}, defaultOpts, methodOpts),
        filterOpts = opts.filter,
        sortObj = {},
        dbOpts = {},
        relays = collections.relays,
        bridges = collections.bridges;

    sortObj[opts.sort] = opts.sortAscending ? 1 : -1;

    if (filterOpts === null || filterOpts.inactive === false) {
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
        relays: RSVP.denodeify(relays
            .find(dbOpts)
            .sort(sortObj)
            .toArray.bind(relays))(),
        bridges: RSVP.denodeify(bridges
            .find(dbOpts)
            .sort(sortObj)
            .toArray.bind(bridges))()
    });
};