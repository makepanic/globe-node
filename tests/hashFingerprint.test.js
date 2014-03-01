var hashFingerprint = require('../lib/onionoo/util/hashFingerprint');

exports['hash valid fingerprints and compare'] = function(test){
    test.expect(2);
    test.equals(hashFingerprint('123456789012345678901234567890abcdef1234'), 'D62980B13FA37EEBF1B1EAD16A8A876A6ED5D0AE');
    test.equals(hashFingerprint('0000000000000000000000000000000000000000'), '6768033E216468247BD031A0A2D9876D79818F8F');
    test.done();
};

exports['hash invalid fingerprints'] = function(test) {
    test.expect(5);

    var scope = null,
        callingFunction = function(val){
            hashFingerprint(val)
        };

    test.throws(callingFunction.bind(scope, null));
    test.throws(callingFunction.bind(scope, undefined));
    test.throws(callingFunction.bind(scope, -1));
    test.throws(callingFunction.bind(scope, false));
    test.throws(callingFunction.bind(scope, 'some other string äüö'));
    test.done();
};