var crypto = require('crypto'),
    errors = require('../errors'),
    is40CharHex = require('./is40CharHex');

var sha1;

module.exports = function(fingerprint) {
    var hashed = '';

    if (is40CharHex(fingerprint)) {
        sha1 = crypto.createHash('sha1');

        var buf = new Buffer(fingerprint, 'hex'),
            fingerBin = sha1.update(buf.toString('binary'));

        hashed = fingerBin.digest('hex');
    } else {
        throw errors.NotA40CharHexString;
    }
    return hashed.toUpperCase();
};