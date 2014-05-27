var range = require('../lib/util/range');

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    'test with some basic values': function (test) {
        // taken from https://docs.python.org/release/1.5.1p1/tut/range.html

        test.deepEqual(range(10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        test.deepEqual(range(5, 10), [5, 6, 7, 8, 9]);
        test.deepEqual(range(0, 10, 3), [0, 3, 6, 9]);
        test.deepEqual(range(-10, -100, -30), [-10, -40, -70]);
        test.deepEqual(range(2, 0), []);

        test.done();
    }
};