var range = require('../../util/range');

module.exports = function (items, requiredPorts) {
    return items.filter(function (relay) {
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
            // check if request ports are in stored object
            filteredObjects = requiredPorts.every(function (key) {
                return portsObj[key];
            });
        } else if (target === 'reject') {
            // check if request ports are't in stored object
            filteredObjects = !requiredPorts.every(function (key) {
                return portsObj[key];
            });
        } else {
            throw 'exit_policy_summary isn\'t reject or accept';
        }

        return filteredObjects;
    });
};