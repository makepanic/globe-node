var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    RSVP = require('rsvp'),
    request = require('request');

module.exports = function(fingerprint, isHashed, store) {
    var storedDetail,
        hashedFingerprint = fingerprint;

    if (!isHashed) {
        hashedFingerprint = hashFingerprint(fingerprint);
    }
    hashedFingerprint = hashedFingerprint.toUpperCase();

    storedDetail = store.find('details', hashedFingerprint);
    if (storedDetail === undefined) {
        // not stored
        return new RSVP.Promise(function(resolve){
            var url ='https://onionoo.torproject.org/details?lookup=' + hashedFingerprint;
            request({
                url: url,
                timeout: 5000
            }, function(err, resp, body){
                if (err) {
                    throw err;
                }

                var result = JSON.parse(body);

                var detailsObj = normalize.details(result);

                // use first object from relay and bridge array as detail object
                var detailObj = {
                    relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                    bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
                };

                store.store('details', hashedFingerprint, detailObj);
                resolve(detailObj);
            })

        });
    } else {
        return new RSVP.Promise(function(resolve){
            resolve(storedDetail);
        });
    }

};