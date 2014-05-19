/*eslint camelcase:0, no-console:0 */

var filter = require('../lib/db/onionoo-mongo/filter'),
    group = require('../lib/db/onionoo-mongo/group'),
    speeds = require('../lib/db/onionoo-mongo/speeds');

function createFilterRequestFn(collections) {
    var DISPLAY_LIMIT = 10;

    return function (req, res) {
        filter(collections, {
            filter: {
                exitSpeed: speeds.FAST_EXIT_ANY_NETWORK
            }
        }).then(function (result) {

            var relay,
                notDisplayed = {
                    relays: {
                        number: 0,
                        consensus_weight_fraction: 0,
                        advertised_bandwidth_fraction: 0,
                        guard_probability: 0,
                        middle_probability: 0,
                        exit_probability: 0
                    },
                    bridges: {}
                };

            function canAdd(val) {
                return val !== null && val !== undefined && val !== -1;
            }

            // generate aggregated results
            for (var index = 0, max = result.relays.length; index < max; index++) {
                // result.relays.forEach(function(relay){
                relay = result.relays[index];

                if (index >= DISPLAY_LIMIT) {
                    // is not displayed
                    notDisplayed.relays.number++;
                    notDisplayed.relays.consensus_weight_fraction += canAdd(relay.consensus_weight_fraction) ? relay.consensus_weight_fraction : 0;
                    notDisplayed.relays.advertised_bandwidth_fraction += canAdd(relay.advertised_bandwidth_fraction) ? relay.advertised_bandwidth_fraction : 0;
                    notDisplayed.relays.guard_probability += canAdd(relay.guard_probability) ? relay.guard_probability : 0;
                    notDisplayed.relays.middle_probability += canAdd(relay.middle_probability) ? relay.middle_probability : 0;
                    notDisplayed.relays.exit_probability += canAdd(relay.exit_probability) ? relay.exit_probability : 0;
                } else {
                    var precision = 8;

                    console.log('%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s',
                            index + 1,
                        relay.consensus_weight_fraction.toFixed(precision),
                        relay.advertised_bandwidth_fraction.toFixed(precision),
                        relay.guard_probability.toFixed(precision),
                        relay.middle_probability.toFixed(precision),
                        relay.exit_probability.toFixed(precision),
                        relay.fingerprint.substr(0, 8),
                        relay.country,
                        relay.nickname
                    );
                }
            }

            console.log(
                'other relays',
                notDisplayed.relays
            );

            res.send({
                notDisplayed: notDisplayed,
                bridges: result.bridges.length,
                relays: result.relays.length
            });
        }, function (err) {
            console.error(err);
        });
    };
}

function createGroupRequestFn(collections) {
    var DISPLAY_LIMIT = 10;

    return function (req, res) {
        group(collections, {}).then(function (result) {
            // sort by consensus_weight_fraction
            result.relays = result.relays.sort(function (a, b) {
                return b.consensus_weight_fraction - a.consensus_weight_fraction;
            });

            var relay,
                notDisplayed = {
                    relays: {
                        countries: 0,
                        number: 0,
                        consensus_weight_fraction: 0,
                        advertised_bandwidth_fraction: 0,
                        guard_probability: 0,
                        middle_probability: 0,
                        exit_probability: 0,
                        fingerprints: []
                    },
                    bridges: {}
                },
                logFormat = '%s\t%s\t%s\t%s\t%s\t%s\trelays: %s\t%s';

            function canAdd(val) {
                return val !== null && val !== undefined && val !== -1;
            }

            // generate aggregated results
            for (var index = 0, max = result.relays.length; index < max; index++) {
                // result.relays.forEach(function(relay){
                relay = result.relays[index];

                if (index >= DISPLAY_LIMIT) {
                    // is not displayed
                    notDisplayed.relays.countries++;
                    notDisplayed.relays.fingerprints = notDisplayed.relays.fingerprints.concat(relay.fingerprints);
                    notDisplayed.relays.consensus_weight_fraction += canAdd(relay.consensus_weight_fraction) ? relay.consensus_weight_fraction : 0;
                    notDisplayed.relays.advertised_bandwidth_fraction += canAdd(relay.advertised_bandwidth_fraction) ? relay.advertised_bandwidth_fraction : 0;
                    notDisplayed.relays.guard_probability += canAdd(relay.guard_probability) ? relay.guard_probability : 0;
                    notDisplayed.relays.middle_probability += canAdd(relay.middle_probability) ? relay.middle_probability : 0;
                    notDisplayed.relays.exit_probability += canAdd(relay.exit_probability) ? relay.exit_probability : 0;
                } else {
                    var precision = 8;

                    console.log(logFormat,
                            index + 1,
                        relay.consensus_weight_fraction.toFixed(precision),
                        relay.advertised_bandwidth_fraction.toFixed(precision),
                        relay.guard_probability.toFixed(precision),
                        relay.middle_probability.toFixed(precision),
                        relay.exit_probability.toFixed(precision),
                        relay.fingerprints.length,
                        relay.country
                    );
                }
            }

            console.log('%s\t%s\t%s\t%s\t%s\t%s\trelays: %s\trelay groups:%s',
                '',
                notDisplayed.relays.consensus_weight_fraction.toFixed(precision),
                notDisplayed.relays.advertised_bandwidth_fraction.toFixed(precision),
                notDisplayed.relays.guard_probability.toFixed(precision),
                notDisplayed.relays.middle_probability.toFixed(precision),
                notDisplayed.relays.exit_probability.toFixed(precision),
                notDisplayed.relays.fingerprints.length,
                notDisplayed.relays.countries
            );

            res.send({
                notDisplayed: notDisplayed.length,
                bridges: result.bridges.length,
                relays: result.relays.length
            });
        });
    };
}

exports.filter = createFilterRequestFn;
exports.group = createGroupRequestFn;