var hashFingerprint = require('../util/hashFingerprint'),
    processHistoryResponse = require('../util/processHistoryResponse'),
    RSVP = require('rsvp'),
    getJSON = require('../util/getJSON');

/**
 * Uses the onionoo api to request bandwidth documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with relays and bridges bandwidth details.
 */
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

        getJSON('bandwidth?lookup=' + hashedFingerprint).then(function(result){
            resolve(processHistoryResponse({
                readHistory: 'read_history',
                writeHistory: 'write_history'
            }, result));
        });
    });
};