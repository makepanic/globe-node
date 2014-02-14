var countryFlag = require('../lib/util/countryFlag'),
    constants = require('../lib/static');

exports['checks country flags formatter'] = function(test){
    test.expect(9);

    var testFn = countryFlag,
        dataEmpty = '<span title="' + constants.messages.dataEmpty + '" data-tooltip class="country-flag empty_png"></span>';

    test.equals(testFn(undefined),        dataEmpty, 'test for undefined');
    test.equals(testFn(null),             dataEmpty, 'test for null');
    test.equals(testFn(0),                dataEmpty, 'test for 0');
    test.equals(testFn(1),                dataEmpty, 'test for 1');
    test.equals(testFn(-1),               dataEmpty, 'test for -1');
    test.equals(testFn(NaN),              dataEmpty, 'test for NaN');
    test.equals(testFn('string'),         dataEmpty, 'test for "string"');

    test.equals(testFn('de'), '<span title="Germany" data-tooltip class="country-flag de_png"></span>',   'test for "de"');
    test.equals(testFn('kp'), '<span title="North Korea" data-tooltip class="country-flag kp_png"></span>',   'test for "de"');

    test.done();
};