var uptimeCalculator = require('../lib/util/UptimeCalculator'),
    moment = require('moment').utc,
    sinon = require('sinon');

exports['checks uptimecalculator for empty values'] = function(test){
    var testFn = uptimeCalculator;

    test.expect(4);

    test.deepEqual(testFn(null), []);
    test.deepEqual(testFn(undefined), []);
    test.deepEqual(testFn(1), []);
    test.deepEqual(testFn(''), []);

    test.done();
};

exports['checks uptimeCalculator to return correct values'] = function(test) {
    var testFn = uptimeCalculator,
        clock;

    clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());
    test.deepEqual(testFn('2014-04-07 08:00:00', 'long'), ['8<span>hours</span>', '26<span>minutes</span>'], 'uptime correctly computed');
    clock.restore();

    test.done();
};