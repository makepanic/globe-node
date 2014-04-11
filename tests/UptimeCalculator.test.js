var uptimeCalculator = require('../lib/util/UptimeCalculator'),
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

    clock = sinon.useFakeTimers((new Date("April 7, 2014 16:26:00")).getTime());
    test.deepEqual(testFn('2014-04-07 08:00:00', 'long'), ['8<span>hours</span>', '26<span>minutes</span>'], 'uptime correctly computed');
    clock.restore();

    test.done();
};