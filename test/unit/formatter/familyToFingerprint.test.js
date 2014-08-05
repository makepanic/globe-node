/* global describe, it */

var expect = require('expect.js');

describe('familyToFingerprint', function () {
    var familyToFingerprint = require('../../../src/lib/util/formatter').familyToFingerprint;
    var callingFunction = function(val) {
            familyToFingerprint(val);
        };

    it('tests with invalid values', function () {
        expect(callingFunction.bind(null, '123456789012345678901234567890abcdef1234'))
            .to.throwException();
        expect(callingFunction.bind(null, 'asd'))
            .to.throwException();
        expect(callingFunction.bind(null, 1))
            .to.throwException();
        expect(callingFunction.bind(null, null))
            .to.throwException();
    });

    it('tests with valid values', function () {
        expect(familyToFingerprint('$123456789012345678901234567890abcdef1234'))
            .to.be.ok();
        expect(familyToFingerprint('$0000000000000000000000000000000000000000'))
            .to.be.ok();
    });
});
