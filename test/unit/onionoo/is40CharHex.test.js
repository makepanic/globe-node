/* global describe, it */

var expect = require('expect.js');

describe('is40CharHex', function() {
    var is40CharHex = require('../../../src/lib/onionoo/util/is40CharHex');

    it('tests with valid values', function() {
        expect(is40CharHex('123456789012345678901234567890abcdef1234')).to.be.ok();
        expect(is40CharHex('0000000000000000000000000000000000000000')).to.be.ok();
    });
    it('tests with invalid values', function() {
        expect(is40CharHex('0000000000000000000000000000g00000000000')).not.to.be.ok();
        expect(is40CharHex('asd')).not.to.be.ok();
        expect(is40CharHex(1)).not.to.be.ok();
        expect(is40CharHex(null)).not.to.be.ok();
        expect(is40CharHex()).not.to.be.ok();
        expect(is40CharHex(true)).not.to.be.ok();
    });
});