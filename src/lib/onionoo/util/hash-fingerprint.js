var crypto = require('crypto'),
    errors = require('../errors'),
    is40CharHex = require('./is-fingerprint');

var sha1;

/**
 * Hashes a fingerprint by converting the fingerprint to hex, to binary, apply SHA1, convert back to hex.
 * @see {@link https://trac.torproject.org/projects/tor/ticket/6320#comment:1}
 * @param {String} fingerprint Fingerprint to hash.
 * @returns {String} hashed uppercase fingerprint
 * @throws {errors.NotA40CharHexString}
 */
module.exports = function(fingerprint) {
    var hashed = '';

    if (is40CharHex(fingerprint)) {
        sha1 = crypto.createHash('sha1');

        var buf = new Buffer(fingerprint, 'hex'),
            fingerBin = sha1.update(buf.toString('binary'));

        hashed = fingerBin.digest('hex');
    } else {
        throw errors.NotA40CharHexString + ' Got ' + fingerprint;
    }
    return hashed.toUpperCase();
};
