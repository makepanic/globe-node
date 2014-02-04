var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed, store) {
        return new RSVP.Promise(function(resolve, reject){
            var storedDetail,
                hashedFingerprint = fingerprint;

            if (!isHashed) {
                try{
                    hashedFingerprint = hashFingerprint(fingerprint);
                } catch (e) {
                    reject(e);
                }
            }
            hashedFingerprint = hashedFingerprint.toUpperCase();

            storedDetail = store.find('details', hashedFingerprint);
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
                        } catch (e) {
                            reject(e);
                        }

                        detailsObj = normalize.details(result);

                        // use first object from relay and bridge array as detail object
                        var detailObj = {
                            relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                            bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
                        };

                        store.store('details', hashedFingerprint, detailObj);
                        resolve(detailObj);
                    }
                });
            }
        });
};