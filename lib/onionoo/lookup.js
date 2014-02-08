var hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize'),
    store = require('../storage/storage'),
    keys = require('../storage/storageKeys'),
    RSVP = require('rsvp'),
    request = require('request');

// listen for expired details and reload them
store.on(keys.DETAILS, 'expired', function(value){
    // if store is expired reload (which stores the new value again)
    lookup(value.key);
});

function lookup(fingerprint, isHashed) {
    return new RSVP.Promise(function(resolve, reject){
        var hashedFingerprint = fingerprint.toUpperCase();

        if (!isHashed) {
            try{
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (e) {
                reject(e);
            }
        }

        store.find(keys.DETAILS, hashedFingerprint).then(function(storedDetail){
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

                        store.store(keys.DETAILS, hashedFingerprint, detailObj).then(function(storedData){
                            console.log('stored detail');
                            resolve(storedData);
                        });
                    }
                });
            }
        });
    });
}

module.exports = lookup;