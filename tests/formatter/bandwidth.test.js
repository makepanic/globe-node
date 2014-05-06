var formatter = require('../../lib/util/formatter');

exports['checks bandwidth'] = function(test){
    var testFn = formatter.bandwidth,
        dataEmpty = '';

    test.expect(11);

    test.equals(testFn(-1), dataEmpty, 'test for -1');
    test.equals(testFn(undefined), dataEmpty, 'test for undefined');
    test.equals(testFn(null), dataEmpty, 'test for null');
    test.equals(testFn(NaN), dataEmpty, 'test for NaN');
    test.equals(testFn('string'), dataEmpty, 'test for "string"');

    test.equals(testFn(0), '0 B/s', 'test for 0');
    test.equals(testFn(1.5), '1 B/s', 'test for 1.5');
    test.equals(testFn(1), '1 B/s', 'test for 1');
    test.equals(testFn(1000), '1 kB/s', 'test for 1000');
    test.equals(testFn(1234), '1.23 kB/s','test for 1234');
    test.equals(testFn(1000000), '1 MB/s', 'test for 1000000');

    test.done();
};