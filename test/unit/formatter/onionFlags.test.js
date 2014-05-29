/* global describe, it */

var expect = require('expect.js');

describe('onionFlags', function () {
    var onionFlags = require('../../../src/lib/util/formatter').onionFlags;
    var dataEmpty = '';

    it('tests with invalid values', function () {
        expect(onionFlags(null)).to.be(dataEmpty);
        expect(onionFlags(undefined)).to.be(dataEmpty);
        expect(onionFlags(0)).to.be(dataEmpty);
        expect(onionFlags(NaN)).to.be(dataEmpty);
        expect(onionFlags('string')).to.be(dataEmpty);
    });

    it('tests with valid values', function () {
        expect(onionFlags(['Fast', 'Exit']))
            .to.be('<span class="fa fa-bolt" title="Fast"></span><span class="fa fa-sign-out" title="Exit"></span>');
    });
});