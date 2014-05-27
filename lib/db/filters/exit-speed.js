var range = require('../../util/range'),
    assert = require('assert'),
    _ = require('lodash');

module.exports = function (items, requiredPorts) {
    assert(_.isArray(items), 'ExitSpeedFilter needs items array');

    return items.filter(function (relay) {
        assert(relay.exit_policy_summary.hasOwnProperty('accept') || relay.exit_policy_summary.hasOwnProperty('reject'),
            'Exit policy summary has either accept or reject');

        var target = relay.exit_policy_summary.accept ? 'accept' : 'reject',
            ports = relay.exit_policy_summary['_' + target],
            portRanges = relay.exit_policy_summary['_' + target + '_range'],
            portsObj = {},
            filteredObjects = [];

        // create array with all ports
        portRanges.forEach(function (portRange) {
            ports = ports.concat(range(portRange.start, portRange.end + 1));
        });

        // create "hashmap" for easier issubset equivalent
        portsObj = ports.reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {});

        if (target === 'accept') {
            // accept: check if request ports are in stored object
            filteredObjects = requiredPorts.every(function (key) {
                return portsObj[key];
            });
        } else {
            // reject: check if request ports are't in stored object
            filteredObjects = requiredPorts.every(function (key) {
                return !portsObj[key];
            });
        }

        return filteredObjects;
    });
};