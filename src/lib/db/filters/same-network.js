var rsplit = require('../../util/rsplit'),
    _ = require('lodash-node'),
    logger = require('../../../../logger');

module.exports = function (items, maxPerNetwork) {
    var netData = {};

    // same network filter is a copy of compass.py SameNetworkFilter
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++){
        var relay = items[itemIndex];
        var orAddresses = relay.or_addresses,
            numAddresses = 0;

        for (var orIndex = 0; orIndex < orAddresses.length; orIndex++) {
            var orAddress = orAddresses[orIndex];
//        orAddresses.forEach(function (orAddress) {
            var split = rsplit(orAddress, ':', 1),
                ip = split[0],
                network;

            // skip if is ipv6
            if (ip.indexOf(':') > -1) { break; }

            numAddresses++;

            if (numAddresses > 1) {
                logger.info('%s has more than one IPv4 OR address - %s', relay.fingerprint, orAddresses.join(', '));
                break;
            }

            network = rsplit(orAddress, '.', 1)[0];

            if (netData[network]) {
                if (netData[network].length >= maxPerNetwork) {
                    var minExit = relay.exit_probability,
                        minIndex = -1;

                    for (var netIndex = 0; netIndex < netData[network].length; netIndex++) {
                        var value = netData[network][netIndex];
                        if (value.exit_probability < minExit) {
                            minExit = value.exit_probability;
                            minIndex = netIndex;
                        }
                    }
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
        }
    }

    return _.flatten(_.values(netData));
};
