var filter = require('../lib/db/onionoo-mongo/filter');

exports.filter = function (collections) {
    var DISPLAY_LIMIT = 10;

    return function (req, res) {
        filter(collections, {}).then(function (result) {

            var notDisplayed = {
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
            result.relays.forEach(function (relay, index) {
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
                    console.log(
                        '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s',
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
            });

            console.log(
                'other relays',
                notDisplayed.relays
            );

            res.send({
                notDisplayed: notDisplayed,
                bridges: result.bridges.length,
                relays: result.relays.length
            });
        })
    }
};