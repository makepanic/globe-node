/* global describe, it */
/* eslint camelcase:0 */

var expect = require('expect.js');

describe('exit-speed', function () {
    var exitSpeedFilter = require('../../../../src/lib/db/filters/exit-speed'),
        speeds = require('../../../../src/lib/db/onionoo-mongo/speeds');

    it('tests with empty values', function () {
        expect(exitSpeedFilter([], speeds.ALMOST_FAST_EXIT.PORTS))
            .to.eql([]);
    });

    it('tests with invalid values', function () {
        expect(function () {
            exitSpeedFilter([{}], speeds.ALMOST_FAST_EXIT.PORTS);
        }).to.throwException();
    });

    describe('accept', function () {
        it('tests using a port array', function () {
            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    accept: ['80', '443'],
                    _accept: [80, 443],
                    _accept_range: []
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([{
                exit_policy_summary: {
                    accept: ['80', '443'],
                    _accept: [80, 443],
                    _accept_range: []
                }
            }]);
        });
        it('tests using a port range', function () {
            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    accept: ['80-443'],
                    _accept: [],
                    _accept_range: [{
                        start: 80,
                        end: 443
                    }]
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([{
                exit_policy_summary: {
                    accept: ['80-443'],
                    _accept: [],
                    _accept_range: [{
                        start: 80,
                        end: 443
                    }]
                }
            }]);

            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    accept: ['50-443'],
                    _accept: [],
                    _accept_range: [{
                        start: 81,
                        end: 443
                    }]
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([]);
        });
    });

    describe('reject', function () {
        it('tests using a port array', function () {
            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    reject: ['79', '442'],
                    _reject: [79, 442],
                    _reject_range: []
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([{
                exit_policy_summary: {
                    reject: ['79', '442'],
                    _reject: [79, 442],
                    _reject_range: []
                }
            }]);
        });
        it('tests using a port range', function () {
            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    reject: ['81-442'],
                    _reject: [],
                    _reject_range: [{
                        start: 81,
                        end: 442
                    }]
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([{
                exit_policy_summary: {
                    reject: ['81-442'],
                    _reject: [],
                    _reject_range: [{
                        start: 81,
                        end: 442
                    }]
                }
            }]);

            expect(exitSpeedFilter([{
                exit_policy_summary: {
                    reject: ['55-85'],
                    _reject: [],
                    _reject_range: [{
                        start: 55,
                        end: 85
                    }]
                }
            }], speeds.ALMOST_FAST_EXIT.PORTS)).to.eql([]);
        });
    });
});