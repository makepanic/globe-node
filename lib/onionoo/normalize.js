var defaults = require('./defaults'),
    moment = require('moment'),
    _ = require('lodash');

exports.details = function(result){
    var details = {
        relays: [],
        bridges: []
    };

    if(result &&
        result.hasOwnProperty('relays') &&
        result.hasOwnProperty('bridges')){

        var consensus = {
            bridges: moment(result.bridges_published),
            relays: moment(result.relays_published)
        };

        if(result.relays.length){
            for(var i = 0, numRelays = result.relays.length; i < numRelays; i++){

                // process result relays
                var relay = _.merge({}, defaults.relay, result.relays[i]);
                var relayLastSeenMoment = moment(relay.last_seen);

                // check if consensus.relays and lastSeenMoment exist
                if( consensus.relays && relayLastSeenMoment &&
                    // check if both are valid (moment.isValid)
                    consensus.relays.isValid() && relayLastSeenMoment.isValid()){
                    relay.inLatestConsensus = consensus.relays.isSame(relayLastSeenMoment);
                }

                details.relays.push(relay);

            }
        }

        if(result.bridges.length){
            for(var j = 0, numBridges = result.bridges.length; j < numBridges; j++){
                // process result bridges

                var bridge = _.merge({}, defaults.bridge, result.bridges[j]);
                var bridgeLastSeenMoment = moment(bridge.last_seen);

                // check if consensus.relays and lastSeenMoment exist
                if( consensus.bridges && bridgeLastSeenMoment &&
                    // check if both are valid (moment.isValid)
                    consensus.bridges.isValid() && bridgeLastSeenMoment.isValid()){
                    bridge.inLatestConsensus = consensus.bridges.isSame(bridgeLastSeenMoment);
                }

                details.bridges.push(bridge);
            }
        }
    }
    return details;
};