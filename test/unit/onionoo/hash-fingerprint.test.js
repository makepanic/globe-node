/* global describe, it */

var expect = require('expect.js'),
    assert = require('assert');

describe('hashFingerprint', function() {
    var hashFingerprint = require('../../../src/lib/onionoo/util/hash-fingerprint');

    it('tests with valid fingerprints', function() {
        expect(hashFingerprint('123456789012345678901234567890abcdef1234')).to.be('D62980B13FA37EEBF1B1EAD16A8A876A6ED5D0AE');
        expect(hashFingerprint('0000000000000000000000000000000000000000')).to.be('6768033E216468247BD031A0A2D9876D79818F8F');
    });

    it('tests with invalid fingerprint', function () {
        var callingFunction = function(val){
                hashFingerprint(val);
            };

        expect(callingFunction.bind(null, null)).to.throwException();
        expect(callingFunction.bind(null, undefined)).to.throwException();
        expect(callingFunction.bind(null, -1)).to.throwException();
        expect(callingFunction.bind(null, false)).to.throwException();
        expect(callingFunction.bind(null, 'some other string äöü')).to.throwException();
    });
});
