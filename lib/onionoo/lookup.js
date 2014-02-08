var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    store = require('../storage/storage'),
    RSVP = require('rsvp'),
    request = require('request');

var STORAGE_KEY = 'details';

module.exports = function(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint.toUpperCase();

        if (!isHashed) {
            try{
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (e) {
                reject(e);
            }
        }

        store.find(STORAGE_KEY, hashedFingerprint).then(function(storedDetail){
            if (storedDetail) {
                resolve(storedDetail);
            } else {
                var url = 'https://onionoo.torproject.org/details?lookup=' + hashedFingerprint;

                request({
                    url: url,
                    timeout: 5000
                }, function(err, resp, body){
                    if (err) {
                        reject(err);
                    } else {
                        var result,
                            detailsObj;

                        try {
                            result = JSON.parse(body);
                        } catch (jsonParseErr) {
                            reject(jsonParseErr);
                        }

                        detailsObj = normalize.details(result);

                        // use first object from relay and bridge array as detail object
                        var detailObj = {
                            relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                            bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
                        };

                        store.store(STORAGE_KEY, hashedFingerprint, detailObj).then(function(storedData){
                            resolve(storedData);
                        });
                    }
                });
            }
        });
    });
};