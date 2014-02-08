var hashFingerprint = require('../util/hashFingerprint'),
    store = require('../storage/storage'),
    prepareHistoryItems = require('../util/prepareHistoryItems'),
    RSVP = require('rsvp'),
    request = require('request');

var STORAGE_KEY = 'weights';

module.exports = function(fingerprint, isHashed) {
    var hashedFingerprint = fingerprint;

    if (!isHashed) {
        hashedFingerprint = hashFingerprint(fingerprint);
    }
    hashedFingerprint = hashedFingerprint.toUpperCase();

    return new RSVP.Promise(function(resolve, reject){
        var url = 'https://onionoo.torproject.org/weights?lookup=' + hashedFingerprint;

        store.find(STORAGE_KEY, hashedFingerprint).then(function(storedWeight){
            if (storedWeight) {
                resolve(storedWeight);
            } else {
                request({
                    url: url,
                    timeout: 5000
                }, function(err, resp, body){
                    if (err) {
                        reject(err);
                    } else {
                        var jsonResult,
                            relay,
                            abfHistory,
                            cwfHistory,
                            epHistory,
                            gpHistory,
                            toBuild = {},
                            periods = [],
                            history = {
                                advertisedBandwidth: {},
                                consensusWeightFraction: {},
                                exitProbability: {},
                                guardProbability: {}
                            };

                        try{
                            jsonResult = JSON.parse(body);
                        } catch(jsonError) {
                            reject(jsonError);
                        }

                        if(jsonResult && jsonResult.relays && jsonResult.relays.length){
                            relay = jsonResult.relays[0];

                            abfHistory = relay.advertised_bandwidth_fraction;
                            cwfHistory = relay.consensus_weight_fraction;
                            epHistory = relay.exit_probability;
                            gpHistory = relay.guard_probability;

                            toBuild = {
                                'advertisedBandwidth': abfHistory,
                                'exitProbability': epHistory,
                                'guardProbability': gpHistory,
                                'consensusWeightFraction': cwfHistory
                            };

                            periods = prepareHistoryItems(history, toBuild);
                        }

                        store.store(STORAGE_KEY, hashedFingerprint, {
                            data: history,
                            periods: periods
                        }).then(function(storedItem){
                            resolve(storedItem);
                        });
                    }
                });
            }
        });
    });
};