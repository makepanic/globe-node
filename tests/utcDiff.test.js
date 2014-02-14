var utcDiff = require('../lib/util/utcDiff');

exports['checks utcDiff'] = function(test){
    var testFn = utcDiff;

    test.expect(3);

    test.deepEqual(testFn(null), {});
    test.deepEqual(testFn(undefined), {});
    test.deepEqual(testFn('asd'), {});

    test.done();
};