var formatter = require('../lib/util/formatter');

exports['checks familyToFingerprint'] = function(test){
    var scope = null,
        callingFunction = function(val) {
            formatter.familyToFingerprint(val);
        };

    test.expect(8);
    test.ok(formatter.familyToFingerprint('$123456789012345678901234567890abcdef1234'));
    test.ok(formatter.familyToFingerprint('$0000000000000000000000000000000000000000'));
    test.throws(callingFunction.bind(scope, '123456789012345678901234567890abcdef1234'));
    test.throws(callingFunction.bind(scope, 'asd'));
    test.throws(callingFunction.bind(scope, 1));
    test.throws(callingFunction.bind(scope, null));
    test.throws(callingFunction.bind(scope));
    test.throws(callingFunction.bind(scope, true));
    test.done();
};

exports['checks port'] = function(test){
    var testFn = formatter.port,
        dataEmpty = '';

    test.expect(10);
    test.equals(testFn(undefined), dataEmpty);
    test.equals(testFn(null), dataEmpty);
    test.equals(testFn(0), dataEmpty);
    test.equals(testFn(1), dataEmpty);
    test.equals(testFn(-1), dataEmpty);
    test.equals(testFn(NaN), dataEmpty);
    test.equals(testFn('string'), dataEmpty);
    test.equals(testFn('0.0.0.0:80:80'), dataEmpty);

    test.equals(testFn('0.0.0.0:8080'), '8080');
    test.equals(testFn('0.0.0.0:21'), '21');
    test.done();
};

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
    test.equals(testFn(1000), '1 KB/s', 'test for 1000');
    test.equals(testFn(1234), '1.23 KB/s','test for 1234');
    test.equals(testFn(1000000), '1 MB/s', 'test for 1000000');

    test.done();
};