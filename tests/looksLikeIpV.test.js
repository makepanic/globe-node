var looksLikeIpV = require('../lib/util/looksLikeIpV');

exports['checks looksLikeIpV method'] = function(test){
    test.expect(9);

    var testFn = looksLikeIpV;

    test.equals(testFn('1:2:3:4:5:6:7:8'), '6', 'test for 6');
    test.equals(testFn('::ffff:10.0.0.1'), '6', 'test for 6');
    test.equals(testFn('::ffff:1.2.3.4'), '6', 'test for 6');
    test.equals(testFn('1:2:3:4:5:6:77:88'), '6', 'test for 6');
    test.equals(testFn('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'), '6', 'test for 6');

    test.equals(testFn('127.0.0.1'), '4', 'test for 4');
    test.equals(testFn('192.168.1.1'), '4', 'test for 4');
    test.equals(testFn('255.255.255.255'), '4', 'test for 4');
    test.equals(testFn('0.0.0.0'), '4', 'test for 4');

    test.done();
};