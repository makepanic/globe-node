var hashFingerprint = require('../util/hashFingerprint'),
    RSVP = require('rsvp'),
    compute3DaysPeriod = require('../util/computePeriod/3Days'),
    processHistoryResponse = require('../util/processHistoryResponse'),
    getJSON = require('../util/getJSON');

/**
 * Uses the onionoo api to request weight documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with weights data and periods.
 */
module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint;

        try{
            hashedFingerprint = !isHashed ? hashFingerprint(fingerprint) : fingerprint.toUpperCase();
        } catch (hashErr) {
            reject(hashErr);
        }

        getJSON('weights?lookup=' + hashedFingerprint).then(function(result){
            resolve(compute3DaysPeriod(processHistoryResponse({
                advertisedBandwidth: 'advertised_bandwidth_fraction',
                consensusWeightFraction: 'consensus_weight_fraction',
                exitProbability: 'exit_probability',
                guardProbability: 'guard_probability'
            }, result)));
        });
    });
};