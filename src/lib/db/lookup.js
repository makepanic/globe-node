var hashFingerprint = require('../../lib/onionoo/util/hash-fingerprint'),
    normalize = require('./../../lib/onionoo/util/normalize'),
    connection = require('./connection'),
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
        var hashedFingerprint = fingerprint,
            relayCursor,
            bridgeCursor;

        if (!isHashed) {
            try {
                hashedFingerprint = hashFingerprint(fingerprint);
            } catch (hashErr) {
                reject(hashErr);
            }
        }

        relayCursor = collections.relays.find({
            $or: [
                {fingerprint: hashedFingerprint},
                {fingerprint: fingerprint},
                {hashed_fingerprint: hashedFingerprint},
                {hashed_fingerprint: fingerprint}
            ]
        });
        bridgeCursor = collections.bridges.find({
            $or : [
                {hashed_fingerprint: hashedFingerprint},
                {hashed_fingerprint: fingerprint},
                {hashed_hashed_fingerprint: hashedFingerprint},
                {hashed_hashed_fingerprint: fingerprint}
            ]
        });

        /* eslint camelcase: 0 */
        resolve(
            RSVP.hash({
                relays: RSVP.denodeify(relayCursor.toArray.bind(relayCursor))(),
                bridges: RSVP.denodeify(bridgeCursor.toArray.bind(bridgeCursor))()
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
