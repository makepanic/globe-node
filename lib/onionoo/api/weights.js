var config = require('../config'),
    hashFingerprint = require('../util/hashFingerprint'),
    prepareHistoryItems = require('../util/prepareHistoryItems'),
    RSVP = require('rsvp'),
    request = require('request');

/**
 * Uses the onionoo api to request weight documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with weights data and periods.
 */
module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint,
            url = config.BASE_URL + 'weights?lookup=';

        try{
            hashedFingerprint = !isHashed ? hashFingerprint(fingerprint) : fingerprint.toUpperCase();
        } catch (hashErr) {
            reject(hashErr);
        }

        url += hashedFingerprint;

        request({
            url: url,
            timeout: config.REQUEST_TIMEOUT
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