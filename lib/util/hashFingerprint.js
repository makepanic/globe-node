var hex2bin = require('./hex2bin');
var JsSha = require('jssha');

module.exports = function(fingerprint) {
    var bin = hex2bin(fingerprint),
        fingerBin = new JsSha(bin, 'TEXT'),
        hashed = fingerBin.getHash('SHA-1', 'HEX');
    return hashed.toUpperCase();
}