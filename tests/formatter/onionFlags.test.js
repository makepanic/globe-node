var formatter = require('../../lib/util/formatter');

exports['checks onionFlags'] = function(test){
    var testFn = formatter.onionFlags,
        dataEmpty = '';

    test.deepEqual(testFn(undefined),        dataEmpty, 'test for undefined');
    test.deepEqual(testFn(null),             dataEmpty, 'test for null');
    test.deepEqual(testFn(0),                dataEmpty, 'test for 0');
    test.deepEqual(testFn(1),                dataEmpty, 'test for 1');
    test.deepEqual(testFn(-1),               dataEmpty, 'test for -1');
    test.deepEqual(testFn(NaN),              dataEmpty, 'test for NaN');
    test.deepEqual(testFn('string'),         dataEmpty, 'test for "string"');

    test.deepEqual(testFn(['Fast', 'Exit']), '<span class="fa fa-bolt" title="Fast"></span><span class="fa fa-sign-out" title="Exit"></span>', 'test for correct flag formatting');

    test.done();
};
