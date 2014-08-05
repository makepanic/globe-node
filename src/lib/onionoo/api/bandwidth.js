var hashFingerprint = require('../util/hash-fingerprint'),
    processHistoryResponse = require('../util/process-history'),
    RSVP = require('rsvp'),
    getJSON = require('../util/get-JSON');

/**
 * Uses the onionoo api to request bandwidth documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with relays and bridges bandwidth details.
 */
module.exports = function (fingerprint, isHashed) {
    var hashedFingerprint = fingerprint;

    if (!isHashed) {
        hashedFingerprint = hashFingerprint(fingerprint);
    }
    hashedFingerprint = hashedFingerprint.toUpperCase();

    return getJSON('bandwidth?lookup=' + hashedFingerprint).then(function (result) {
        return processHistoryResponse({
            readHistory: 'read_history',
            writeHistory: 'write_history'
        }, result);
    });
};
