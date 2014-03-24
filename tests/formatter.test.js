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

    test.expect(11);

    test.equals(testFn(undefined), dataEmpty);
    test.equals(testFn(null), dataEmpty);
    test.equals(testFn(0), dataEmpty);
    test.equals(testFn(1), dataEmpty);
    test.equals(testFn(-1), dataEmpty);
    test.equals(testFn(NaN), dataEmpty);
    test.equals(testFn('string'), dataEmpty);
    test.equals(testFn('0.0.0.0:'), dataEmpty);

    test.equals(testFn('0.0.0.0:80:80'), '80');
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

exports['checks propFlag'] = function(test){
    var testFn = formatter.propFlag;

    test.expect(14);

    test.deepEqual(testFn('Fast'), '<span class="fa fa-bolt" title="Fast"></span>');
    test.deepEqual(testFn('Running'), '<span class="fa fa-code-fork" title="Running"></span>');
    test.deepEqual(testFn('BadExit'), '<span class="fa fa-warning" title="BadExit"></span>');
    test.deepEqual(testFn('Authority'), '<span class="fa fa-user-md" title="Authority"></span>');
    test.deepEqual(testFn('Guard'), '<span class="fa fa-shield" title="Guard"></span>');
    test.deepEqual(testFn('HSDir'), '<span class="fa fa-book" title="HSDir"></span>');
    test.deepEqual(testFn('Named'), '<span class="fa fa-info" title="Named"></span>');
    test.deepEqual(testFn('Stable'), '<span class="fa fa-anchor" title="Stable"></span>');
    test.deepEqual(testFn('V2Dir'), '<span class="fa fa-folder" title="V2Dir"></span>');
    test.deepEqual(testFn('Valid'), '<span class="fa fa-check" title="Valid"></span>');
    test.deepEqual(testFn('Unnamed'), '<span class="fa fa-question" title="Unnamed"></span>');
    test.deepEqual(testFn('Exit'), '<span class="fa fa-sign-out" title="Exit"></span>');

    test.deepEqual(testFn('Foo'), '');
    test.deepEqual(testFn(null), '');

    test.done();
};


exports['checks anonymizeIpAddress'] = function(test) {
    var testFn = formatter.anonymizeIpAddress;

    test.equals(testFn('128.0.0.1:9000'), 'IPv4:9000', 'test for ipv4');
    test.equals(testFn('128.0.0.1:80'), 'IPv4:80', 'test for ipv4');

    test.equals(testFn('::ffff:10.0.0.1:9000'), 'IPv6:9000', 'test for ipv6');
    test.equals(testFn('1:2:3:4:5:6:7:8:80'), 'IPv6:80', 'test for ipv6');
    test.equals(testFn('[2001:bc8:3431:101::2]:22'), 'IPv6:22', 'test for ipv6');

    test.done();
};