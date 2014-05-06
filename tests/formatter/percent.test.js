var formatter = require('../../lib/util/formatter');

exports['checks percent'] = function(test){
    var testFn = formatter.percent;

    test.equals(testFn(0.05), '5.00%');
    test.equals(testFn(0.05, 4), '5.0000%');
    test.equals(testFn(0.000005, 4), '0.0005%');

    test.deepEqual(testFn(undefined), '');
    test.deepEqual(testFn('Foo'), '');
    test.deepEqual(testFn(null), '');

    test.done();
};