var hex2bin = require('./hex2bin');
var crypto = require('crypto');
var sha1;

module.exports = function(fingerprint) {
    sha1 = crypto.createHash('sha1');

    var bin = hex2bin(fingerprint),
        fingerBin = sha1.update(bin),
        hashed = fingerBin.digest('hex');
    return hashed.toUpperCase();
}