var exitSpeedFilter = require('../../../lib/db/filters/exit-speed'),
    speeds = require('../../../lib/db/onionoo-mongo/speeds');

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    'input items tests': function (test) {
        test.deepEqual(exitSpeedFilter([], speeds.ALMOST_FAST_EXIT.PORTS), []);
        test.throws(function () {
            exitSpeedFilter([{}], speeds.ALMOST_FAST_EXIT);
        }, 'Item without accept or reject throws an error');
        test.done();
    },
    'tests if correctly filters via port range (accept)': function (test) {

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                accept: ['80', '443'],
                _accept: [80, 443],
                _accept_range: []
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [{
            exit_policy_summary: {
                accept: ['80', '443'],
                _accept: [80, 443],
                _accept_range: []
            }
        }], 'Doesn\'t filter the given relay because the accept ports are the given ports array');

        test.done();
    },
    'tests if the port range is used (accept)': function (test) {

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                accept: ['80-443'],
                _accept: [],
                _accept_range: [{
                    start: 80,
                    end: 443
                }]
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [{
            exit_policy_summary: {
                accept: ['80-443'],
                _accept: [],
                _accept_range: [{
                    start: 80,
                    end: 443
                }]
            }
        }], 'Doesn\'t filter the given relay because the accept port ranges are the given ports array');

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                accept: ['50-443'],
                _accept: [],
                _accept_range: [{
                    start: 81,
                    end: 443
                }]
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [], 'Filters the given relay because the accept port ranges are\'t in the given ports array');

        test.done();
    },
    'tests if correctly filters via port range (reject)': function (test) {

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                reject: ['79', '442'],
                _reject: [79, 442],
                _reject_range: []
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [{
            exit_policy_summary: {
                reject: ['79', '442'],
                _reject: [79, 442],
                _reject_range: []
            }
        }], 'Doesn\'t filter the given relay because the reject ports are\'t in the given ports array');

        test.done();
    },

    'tests if the port range is used (reject)': function (test) {

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                reject: ['81-442'],
                _reject: [],
                _reject_range: [{
                    start: 81,
                    end: 442
                }]
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [{
            exit_policy_summary: {
                reject: ['81-442'],
                _reject: [],
                _reject_range: [{
                    start: 81,
                    end: 442
                }]
            }
        }], 'Doesn\'t filter the given relay because the reject port ranges are the given ports array');

        test.deepEqual(exitSpeedFilter([{
            exit_policy_summary: {
                reject: ['55-85'],
                _reject: [],
                _reject_range: [{
                    start: 55,
                    end: 85
                }]
            }
        }], speeds.ALMOST_FAST_EXIT.PORTS), [], 'Filters the given relay because the reject port ranges are\'t in the given ports array');

        test.done();
    }
};