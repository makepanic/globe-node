var is40CharHex = require('../lib/onionoo/util/is40CharHex');

exports['checks valid strings'] = function(test){
    test.expect(2);
    test.ok(is40CharHex('123456789012345678901234567890abcdef1234'));
    test.ok(is40CharHex('0000000000000000000000000000000000000000'));
    test.done();
};
exports['checks invalid values'] = function(test){
    test.expect(6);
    test.strictEqual(is40CharHex('0000000000000000000000000000g00000000000'), false);
    test.strictEqual(is40CharHex('asd'), false);
    test.strictEqual(is40CharHex(1), false);
    test.strictEqual(is40CharHex(null), false);
    test.strictEqual(is40CharHex(), false);
    test.strictEqual(is40CharHex(true), false);
    test.done();
};