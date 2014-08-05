/* global describe, it */

var expect = require('expect.js');

describe('utcDiff', function() {
    var utcDiff = require('../../src/lib/util/utc-diff');

    it('tests with invalid values', function() {
        var testFn = utcDiff;

        expect(testFn(null)).to.eql({});
        expect(testFn(undefined)).to.eql({});
        expect(testFn('asd')).to.eql({});
    });
});
