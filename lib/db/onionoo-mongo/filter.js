var RSVP = require('rsvp'),
    _ = require('lodash');

var defaultFilterOpts = {
        inactive: null,
        guards: null,
        exit: null,
        family: null,
        as: null,
        country: null,
        speed: null
    },
    addToOptionIf = function (target, targetField, checkValue, assignedValue) {
        if (checkValue !== null) {
            target[targetField] = _.isFunction(assignedValue) ? assignedValue() : assignedValue;
        }
    };

module.exports = function (collections, filterOpts) {
    var opts = _.merge({}, defaultFilterOpts, filterOpts),
        dbOpts = {},
        relays = collections.relays,
        bridges = collections.bridges;

    addToOptionIf(dbOpts, 'running', opts.inactive, opts.inactive);
    addToOptionIf(dbOpts, 'guard_probability', opts.guards, { $gt: 0 });
    addToOptionIf(dbOpts, 'exit_probability', opts.exit, { $gt: 0 });
    addToOptionIf(dbOpts, 'as_number', opts.as, opts.as);
    addToOptionIf(dbOpts, 'country', opts.country, opts.country);
    addToOptionIf(dbOpts, 'family', opts.family, function () { return '$' + opts.family.toUpperCase(); });

    return RSVP.hash({
        relays: RSVP.denodeify(relays.find(dbOpts).toArray.bind(relays))(),
        bridges: RSVP.denodeify(bridges.find(dbOpts).toArray.bind(bridges))()
    });
};