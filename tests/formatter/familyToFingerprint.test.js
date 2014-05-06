var formatter = require('../../lib/util/formatter');

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