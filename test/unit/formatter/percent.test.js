/* global describe, it */

var expect = require('expect.js');

describe('percent', function() {
    var percent = require('../../../src/lib/util/formatter').percent;

    it('tests with valid values', function() {
        expect(percent(0.05)).to.be('5.00%');
        expect(percent(0.05, 4)).to.be('5.0000%');
        expect(percent(0.000005, 4)).to.be('0.0005%');
    });
    it('tests with invalid values', function() {
        expect(percent(undefined)).to.be('');
        expect(percent('Foo')).to.be('');
        expect(percent(null, 4)).to.be('');
    });
});