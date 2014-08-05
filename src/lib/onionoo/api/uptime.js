var hashFingerprint = require('../util/hash-fingerprint'),
    processHistoryResponse = require('../util/process-history'),
    compute3DaysPeriod = require('../util/computePeriod/3Days'),
    RSVP = require('rsvp'),
    getJSON = require('../util/get-JSON');

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

        getJSON('uptime?lookup=' + hashedFingerprint).then(function(result){
            resolve(compute3DaysPeriod(processHistoryResponse({
                uptime: 'uptime'
            }, result)));
        });
    });
};
