var prepareHistoryItems = require('./prepare-history');

module.exports = function(fieldMapping, response) {
    var hasRelays = response && response.relays && response.relays.length,
        hasBridges = response && response.bridges && response.bridges.length,
        relays = {
            history: {},
            periods: []
        },
        bridges = {
            history: {},
            periods: []
        },
        relayToBuild = {},
        bridgeToBuild = {},
        relay = hasRelays ? response.relays[0] : undefined,
        bridge = hasBridges ? response.bridges[0] : undefined;

    if (hasRelays || hasBridges) {
        for (var field in fieldMapping) {
            if (fieldMapping.hasOwnProperty(field)) {
                if (hasRelays) {
                    relays.history[field] = {};
                    relayToBuild[field] = relay[fieldMapping[field]];
                }
                if (hasBridges) {
                    bridges.history[field] = {};
                    bridgeToBuild[field] = bridge[fieldMapping[field]];
                }
            }
        }
        if (hasRelays) {
            relays.periods = prepareHistoryItems(relays.history, relayToBuild);
        }
        if (hasBridges) {
            bridges.periods = prepareHistoryItems(bridges.history, bridgeToBuild);
        }
    }

    return {
        relays: relays,
        bridges: bridges
    };
};
