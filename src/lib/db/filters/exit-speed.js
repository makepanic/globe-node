var assert = require('assert'),
    _ = require('lodash-node');

module.exports = function (items, requiredPorts) {
    assert(_.isArray(items), 'ExitSpeedFilter needs items array');

    return items.filter(function (relay) {
        /* eslint no-loop-func: 0 */
        assert(relay.exit_policy_summary.hasOwnProperty('accept') || relay.exit_policy_summary.hasOwnProperty('reject'),
            'Exit policy summary has either accept or reject');

        var target = relay.exit_policy_summary.accept ? 'accept' : 'reject',
            ports = relay.exit_policy_summary['_' + target],
            portRanges = relay.exit_policy_summary['_' + target + '_range'],
            portsObj = {},
            filteredObjects = [];

        // create array with all ports
        for (var prI = 0, prLength = portRanges.length; prI < prLength; prI++) {
            // create "hashmap" from port ranges
            _.range(portRanges[prI].start, portRanges[prI].end + 1).forEach(function (port) {
                portsObj[port] = true;
            });
        }

        // create "hashmap" for easier issubset equivalent
        for (var pId = 0, pLength = ports.length; pId < pLength; pId++) {
            portsObj[ports[pId]] = true;
        }

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
