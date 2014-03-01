var config = require('../config'),
    hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./../util/normalize'),
    RSVP = require('rsvp'),
    request = require('request');

/**
 * Uses the onionoo api to lookup detail documents for a fingerprint.
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @returns {RSVP.Promise} Promise that resolves with found relay and bridge.
 */
module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint,
            url = config.BASE_URL + 'details?lookup=';

        if (!isHashed) {
            try{
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (hashErr) {
                reject(hashErr);
            }
        }

        url += hashedFingerprint.toUpperCase();

        request({
            url: url,
            timeout: config.REQUEST_TIMEOUT
        }, function(err, resp, body){
            if (err) {
                reject(err);
            } else {
                var result,
                    detailObj,
                    detailsObj;

                try {
                    result = JSON.parse(body);
                } catch (e) {
                    reject(e);
                }

                detailsObj = normalize.details(result);

                // use first object from relay and bridge array as detail object
                detailObj = {
                    relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                    bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
                };

                resolve(detailObj);
            }
        });
    });
};