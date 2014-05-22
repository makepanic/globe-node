var RSVP = require('rsvp');

module.exports = function (filterResults) {
    return new RSVP.Promise(function (resolve, reject) {
        var relay,
            displayed = [],
            displayLimit = filterResults.displayLimit,
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

        // generate aggregated filterResults
        for (var index = 0, max = filterResults.relays.length; index < max; index++) {
            relay = filterResults.relays[index];

            if (index >= displayLimit) {
                // is not displayed
                notDisplayed.relays.number++;
                notDisplayed.relays.consensus_weight_fraction += canAdd(relay.consensus_weight_fraction) ? relay.consensus_weight_fraction : 0;
                notDisplayed.relays.advertised_bandwidth_fraction += canAdd(relay.advertised_bandwidth_fraction) ? relay.advertised_bandwidth_fraction : 0;
                notDisplayed.relays.guard_probability += canAdd(relay.guard_probability) ? relay.guard_probability : 0;
                notDisplayed.relays.middle_probability += canAdd(relay.middle_probability) ? relay.middle_probability : 0;
                notDisplayed.relays.exit_probability += canAdd(relay.exit_probability) ? relay.exit_probability : 0;
            } else {
                displayed.push(relay);
            }
        }

        resolve({
            notDisplayed: notDisplayed,
            displayed: displayed,
            numBridges: filterResults.bridges.length,
            numRelays: filterResults.relays.length
        })
    });
};