var hashFingerprint = require('../util/hashFingerprint'),
    prepareHistoryItems = require('../util/prepareHistoryItems'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint;

        if (!isHashed) {
            try {
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (hashErr) {
                reject(hashErr);
            }
        }
        hashedFingerprint = hashedFingerprint.toUpperCase();

        var url = 'https://onionoo.torproject.org/bandwidth?lookup=' + hashedFingerprint;

        request({
            url: url,
            timeout: 5000
        }, function(err, resp, body){
            if (err) {
                reject(err);
            }

            var jsonResult,
                relays = {
                    history:{
                        writeHistory: {},
                        readHistory: {}
                    },
                    periods: []
                },
                bridges = {
                    history:{
                        writeHistory: {},
                        readHistory: {}
                    },
                    periods: []
                };

            try{
                jsonResult = JSON.parse(body);
            } catch(jsonErr) {
                reject(jsonErr);
            }


            if(jsonResult){
                // relay data processing
                if(jsonResult.relays && jsonResult.relays.length){
                    var relay = jsonResult.relays[0],
                        rHistory = relay.read_history,
                        wHistory = relay.write_history,
                        toBuild = {
                            'writeHistory': wHistory,
                            'readHistory': rHistory
                        };

                    relays.periods = prepareHistoryItems(relays.history, toBuild);
                }

                // bridge data processing
                if(jsonResult.bridges && jsonResult.bridges.length){
                    var bridge = jsonResult.bridges[0],
                        bridgeReadHistory = bridge.read_history,
                        bridgeWriteHistory = bridge.write_history,
                        bridgeToBuild = {
                            'writeHistory': bridgeWriteHistory,
                            'readHistory': bridgeReadHistory
                        };

                    bridges.periods = prepareHistoryItems(bridges.history, bridgeToBuild);
                }
            }

            resolve({
                relays: relays,
                bridges: bridges
            });
        });
    });
};