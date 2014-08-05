/* global describe, it */

var expect = require('expect.js');

describe('uptime formatter', function() {
    var formatter = require('../../../src/lib/util/formatter'),
        moment = require('moment').utc,
        sinon = require('sinon');

    it('tests full uptime', function() {
        var clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());

        expect(formatter.uptimeFull(null)).to.be('');
        expect(formatter.uptimeFull('2014-04-07 08:00:00')).to.be('8<span>hours</span> 26<span>minutes</span>');

        clock.restore();
    });

    it('tests short uptime', function() {
        var clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());

        expect(formatter.uptimeShort(null)).to.be('');
        expect(formatter.uptimeShort('2014-04-07 08:00:00')).to.be('8<span>h</span> 26<span>m</span>');

        clock.restore();
    });
});
