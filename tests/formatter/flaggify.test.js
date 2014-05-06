var formatter = require('../../lib/util/formatter');

exports['checks flaggify'] = function(test){
    var testFn = formatter.flaggify,
        dataEmpty = '<span title="n/a" data-tooltip class="country-flag empty_png"></span>';

    test.deepEqual(testFn(undefined),        dataEmpty, 'test for undefined');
    test.deepEqual(testFn(null),             dataEmpty, 'test for null');
    test.deepEqual(testFn(0),                dataEmpty, 'test for 0');
    test.deepEqual(testFn(1),                dataEmpty, 'test for 1');
    test.deepEqual(testFn(-1),               dataEmpty, 'test for -1');
    test.deepEqual(testFn(NaN),              dataEmpty, 'test for NaN');
    test.deepEqual(testFn('string'),         dataEmpty, 'test for "string"');

    test.deepEqual(testFn('de'), '<span title="Germany" data-tooltip class="country-flag de_png"></span>',   'test for "de"');

    test.done();
};