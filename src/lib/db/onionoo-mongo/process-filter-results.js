/* eslint camelcase:0, no-underscore-dangle: 0 */

var RSVP = require('rsvp'),
    _ = require('lodash');

module.exports = function (filterResults) {
    if (!_.isArray(filterResults.relays)) {
        filterResults.relays = [];
    }
    if (!_.isArray(filterResults.bridges)) {
        filterResults.bridges = [];
    }
    if (!_.isFunction(filterResults.sortFn)) {
        filterResults.sortFn = function (a, b) {
            return b.consensus_weight_fraction - a.consensus_weight_fraction;
        };
    }

    return new RSVP.Promise(function (resolve) {
        var relay,
            displayed = {
                relays: [],
                bridges: []
            },
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

        if (displayLimit <= 0) {
            displayLimit = filterResults.relays.length;
        }

        function canAdd(val) {
            return val !== null && val !== undefined && val !== -1;
        }

        // sort filter results
        filterResults.relays = filterResults.relays.sort(filterResults.sortFn);

        // generate aggregated filterResults
        for (var index = 0, max = filterResults.relays.length; index < max; index++) {
            relay = filterResults.relays[index];

            // remove "private" fields
            delete relay._id;
            delete relay.exit_policy_summary._accept;
            delete relay.exit_policy_summary._accept_range;

            if (index >= displayLimit) {
                // is not displayed
                notDisplayed.relays.number++;
                notDisplayed.relays.consensus_weight_fraction += canAdd(relay.consensus_weight_fraction) ? relay.consensus_weight_fraction : 0;
                notDisplayed.relays.advertised_bandwidth_fraction += canAdd(relay.advertised_bandwidth_fraction) ? relay.advertised_bandwidth_fraction : 0;
                notDisplayed.relays.guard_probability += canAdd(relay.guard_probability) ? relay.guard_probability : 0;
                notDisplayed.relays.middle_probability += canAdd(relay.middle_probability) ? relay.middle_probability : 0;
                notDisplayed.relays.exit_probability += canAdd(relay.exit_probability) ? relay.exit_probability : 0;
            } else {
                displayed.relays.push(relay);
            }
        }

        resolve({
            notDisplayed: notDisplayed,
            displayed: displayed,
            numBridges: filterResults.bridges.length,
            numRelays: filterResults.relays.length
        });
    });
};