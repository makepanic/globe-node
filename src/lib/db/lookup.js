var hashFingerprint = require('../../lib/onionoo/util/hash-fingerprint'),
    normalize = require('./../../lib/onionoo/util/normalize'),
    RSVP = require('rsvp');

/**
 * Uses the database to lookup detail documents for a fingerprint.
 * @param {Object} collections Object with mongodb collections
 * @param {String} fingerprint Fingerprint.
 * @param {Boolean} [isHashed=false] Flag that tells the function the fingerprint is already hashed.
 * @return {rsvp$umd$$RSVP.Promise} Promise that resolves with the lookup result
 */
module.exports = function (collections, fingerprint, isHashed) {
    return new RSVP.Promise(function (resolve, reject) {
        var hashedFingerprint = fingerprint;
        if (!isHashed) {
            try {
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (hashErr) {
                reject(hashErr);
            }
        }

        /* eslint camelcase: 0 */
        resolve(
            RSVP.hash({
                relays: RSVP.denodeify(collections.relays.find({
                    $or: [
                        {fingerprint: hashedFingerprint},
                        {fingerprint: fingerprint}
                    ]
                }).toArray.bind(collections.relays))(),
                bridges: RSVP.denodeify(collections.bridges.find({
                    $or : [
                        {hashed_fingerprint: hashedFingerprint},
                        {hashed_fingerprint: fingerprint}
                    ]
                }).toArray.bind(collections.bridges))()
            }).then(function (result) {
                var detailsObj = normalize.details(result);

                // use first object from relay and bridge array as detail object
                resolve({
                    relay: detailsObj.relays.length ? detailsObj.relays[0] : [],
                    bridge: detailsObj.bridges.length ? detailsObj.bridges[0] : []
                });
            }, function (e) {
                reject(e);
            }));
    });
};
