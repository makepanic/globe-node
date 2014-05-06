var formatter = require('../../lib/util/formatter');

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