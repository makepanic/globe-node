var formatter = require('../../lib/util/formatter'),
    moment = require('moment').utc,
    sinon = require('sinon');

exports['checks uptimeFull'] = function(test){
    var testFn = formatter.uptimeFull,
        clock;

    test.deepEqual(testFn(null), '');

    clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());
    test.deepEqual(testFn('2014-04-07 08:00:00', 'long'), '8<span>hours</span> 26<span>minutes</span>', 'uptime correctly computed');
    clock.restore();

    test.done();
};

exports['checks uptimeShort'] = function(test){
    var testFn = formatter.uptimeShort,
        clock;

    test.deepEqual(testFn(null), '');

    clock = sinon.useFakeTimers(moment('2014-04-07 16:26:00').valueOf());
    test.deepEqual(testFn('2014-04-07 08:00:00', 'long'), '8<span>h</span> 26<span>m</span>', 'uptime correctly computed');
    clock.restore();

    test.done();
};