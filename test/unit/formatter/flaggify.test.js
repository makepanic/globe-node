/* global describe, it */

var expect = require('expect.js');

describe('flaggify', function () {
    var flaggify = require('../../../src/lib/util/formatter').flaggify;
    var dataEmpty = '<span title="n/a" data-tooltip class="country-flag empty_png"></span>';

    it('tests with invalid values', function () {
        expect(flaggify(null)).to.be(dataEmpty);
        expect(flaggify(undefined)).to.be(dataEmpty);
        expect(flaggify(0)).to.be(dataEmpty);
        expect(flaggify(NaN)).to.be(dataEmpty);
        expect(flaggify('string')).to.be(dataEmpty);
    });

    it('tests with valid values', function () {
        expect(flaggify('de'))
            .to.be('<span title="Germany" data-tooltip class="country-flag de_png"></span>');
    });
});