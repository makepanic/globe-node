/* global describe, it */

var expect = require('expect.js');

describe('sort indicator test', function () {
    var sortIndicator = require('../../../src/lib/util/formatter').sortIndicator;
    var dataEmpty = '<i class="fa fa-sort-amount-desc"></i>';

    it('tests with invalid values', function () {
        expect(sortIndicator(null)).to.be(dataEmpty);
        expect(sortIndicator(undefined)).to.be(dataEmpty);
    });

    it('tests with valid values', function () {
        expect(sortIndicator('alpha'))
            .to.be('<i class="fa fa-sort-alpha-desc"></i>');
        expect(sortIndicator('alpha', true))
            .to.be('<i class="fa fa-sort-alpha-asc"></i>');
        expect(sortIndicator('numeric', true))
            .to.be('<i class="fa fa-sort-numeric-asc"></i>');
        expect(sortIndicator('numeric'))
            .to.be('<i class="fa fa-sort-numeric-desc"></i>');
    });
});
