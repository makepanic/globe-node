/* global describe, it */

var expect = require('expect.js');

describe('uptimeCalculator', function () {
    var uptimeCalculator = require('../../src/lib/util/UptimeCalculator'),
        moment = require('moment').utc,
        sinon = require('sinon');

    var testFn = uptimeCalculator;

    it('tests with invalid values', function () {
        expect(testFn(null)).to.eql({});
        expect(testFn(undefined)).to.eql({});
        expect(testFn(1)).to.eql({});
        expect(testFn('')).to.eql({});
    });

    it('tests using a timestamp', function () {
        var clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());

        expect(testFn('2014-04-07 08:00:00', 'long')).to.eql(['8<span>hours</span>', '26<span>minutes</span>']);
        clock.restore();
    });
});