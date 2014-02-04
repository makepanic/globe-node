var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    prepareHistoryItems = require('../util/prepareHistoryItems'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed, store) {
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

            try{
                var result = JSON.parse(body);
            } catch(jsonErr) {
                reject(jsonErr);
            }

            var relays = {
                history:{
                    writeHistory: {},
                    readHistory: {}
                },
                periods: []
            };
            var bridges = {
                history:{
                    writeHistory: {},
                    readHistory: {}
                },
                periods: []
            };

            if(result){
                // relay data processing
                if(result.relays && result.relays.length){
                    var relay = result.relays[0];
                    var rHistory = relay.read_history,
                        wHistory = relay.write_history;
                    var toBuild = {
                        'writeHistory': wHistory,
                        'readHistory': rHistory
                    };

                    relays.periods = prepareHistoryItems(relays.history, toBuild);
                }

                // bridge data processing
                if(result.bridges && result.bridges.length){
                    var bridge = result.bridges[0];
                    var bridgeReadHistory = bridge.read_history,
                        bridgeWriteHistory = bridge.write_history;
                    var bridgeToBuild = {
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