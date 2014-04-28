var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./../util/normalize'),
    RSVP = require('rsvp'),
    getJSON = require('../util/getJSON');

/**
 * Uses the onionoo api to lookup detail documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with found relay and bridge.
 */
module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint,
            url = 'details?lookup=';

        if (!isHashed) {
            try{
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (hashErr) {
                reject(hashErr);
            }
        }

        url += hashedFingerprint.toUpperCase();

        getJSON(url).then(function getJsonResolve(result) {
            var detailsObj = normalize.details(result);

            // use first object from relay and bridge array as detail object
            resolve({
                relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
            });
        }, function getJsonReject(e) {
            reject(e);
        });
    });
};