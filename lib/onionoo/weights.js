var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    prepareHistoryItems = require('../util/prepareHistoryItems'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed, store) {
    var hashedFingerprint = fingerprint;

    if (!isHashed) {
        hashedFingerprint = hashFingerprint(fingerprint);
    }
    hashedFingerprint = hashedFingerprint.toUpperCase();

    return new RSVP.Promise(function(resolve, reject){
        var url = 'https://onionoo.torproject.org/weights?lookup=' + hashedFingerprint;

        request({
            url: url,
            timeout: 5000
        }, function(err, resp, body){
            if (err) {
                reject(err);
            }

            try{
                var result = JSON.parse(body);
            } catch(jsonError) {
                reject(jsonError);
            }

            var history = {
                advertisedBandwidth: {},
                consensusWeightFraction: {},
                exitProbability: {},
                guardProbability: {}
            };
            var periods = [];

            if(result && result.relays && result.relays.length){
                var relay = result.relays[0];

                var abfHistory = relay.advertised_bandwidth_fraction,
                    cwfHistory = relay.consensus_weight_fraction,
                    epHistory = relay.exit_probability,
                    gpHistory = relay.guard_probability;

                var toBuild = {
                    'advertisedBandwidth': abfHistory,
                    'exitProbability': epHistory,
                    'guardProbability': gpHistory,
                    'consensusWeightFraction': cwfHistory
                };

                periods = prepareHistoryItems(history, toBuild);
            }

            resolve({
                data: history,
                periods: periods
            });
        });
    });
};