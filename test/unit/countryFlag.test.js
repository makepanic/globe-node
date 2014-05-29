/* global describe, it */

var expect = require('expect.js');

describe('countryFlag', function () {
    var countryFlag = require('../../src/lib/util/countryFlag'),
        constants = require('../../src/lib/static');

    it('checks country flags formatter with invalid values', function () {
        var dataEmpty = '<span title="' + constants.messages.dataEmpty + '" data-tooltip class="country-flag empty_png"></span>';

        expect(countryFlag(undefined)).to.be(dataEmpty);
        expect(countryFlag(null)).to.be(dataEmpty);
        expect(countryFlag(0)).to.be(dataEmpty);
        expect(countryFlag(NaN)).to.be(dataEmpty);
        expect(countryFlag('string')).to.be(dataEmpty);
    });

    it('checks country flags formatter with valid values', function () {
        expect(countryFlag('de')).to.be('<span title="Germany" data-tooltip class="country-flag de_png"></span>');
        expect(countryFlag('kp')).to.be('<span title="North Korea" data-tooltip class="country-flag kp_png"></span>');
    });
});