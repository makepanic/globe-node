var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint,
            url = 'https://onionoo.torproject.org/details?lookup=';

        if (!isHashed) {
            try{
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (e) {
                reject(e);
            }
        }

        url += hashedFingerprint.toUpperCase();

        request({
            url: url,
            timeout: 5000
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