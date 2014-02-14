var uptimeCalculator = require('../lib/util/UptimeCalculator');

exports['checks uptimecalculator'] = function(test){
    var testFn = uptimeCalculator;

    test.expect(4);

    test.deepEqual(testFn(null), []);
    test.deepEqual(testFn(undefined), []);
    test.deepEqual(testFn(1), []);
    test.deepEqual(testFn(''), []);

    test.done();
};