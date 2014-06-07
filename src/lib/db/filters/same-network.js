/*eslint no-console:0 */

var rsplit = require('../../util/rsplit');

module.exports = function (items, maxPerNetwork) {
    var netData = {};

    // same network filter is a copy of compass.py SameNetworkFilter
    items.forEach(function (relay) {
        var orAddresses = relay.or_addresses,
            numAddresses = 0;

        orAddresses.forEach(function (orAddress) {
            var split = rsplit(orAddress, ':', 1),
                ip = split[0],
                network;

            // skip if is ipv6
            if (ip.indexOf(':') > -1) { return; }

            numAddresses++;

            if (numAddresses > 1) {
                console.log('%s has more than one IPv4 OR address - %s', relay.fingerprint, orAddresses.join(', '));
                return;
            }

            network = rsplit(orAddress, '.', 1)[0];

            if (netData[network]) {
                if (netData[network].length >= maxPerNetwork) {
                    var minExit = relay.exit_probability,
                        minIndex = -1;

                    netData[network].forEach(function (value, index) {
                        if (value.exit_probability < minExit) {
                            minExit = value.exit_probability;
                            minIndex = index;
                        }
                    });
                    if (minIndex !== -1) {
                        netData[network].splice(minIndex, 1);
                        netData[network].push(relay);
                    }
                } else {
                    netData[network].push(relay);
                }
            } else {
                netData[network] = [relay];
            }
        });
    });

    return [].concat.apply([], Object.keys(netData).map(function (key) {
        return netData[key];
    }));
};