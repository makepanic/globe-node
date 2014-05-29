/* global describe, it */

var expect = require('expect.js');

describe('range', function() {
    var range = require('../../src/lib/util/range');

    it('tests with valid values', function() {
        // taken from https://docs.python.org/release/1.5.1p1/tut/range.html

        expect(range(10))
            .to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        expect(range(5, 10))
            .to.eql([5, 6, 7, 8, 9]);

        expect(range(0, 10, 3))
            .to.eql([0, 3, 6, 9]);

        expect(range(-10, -100, -30))
            .to.eql([-10, -40, -70]);

        expect(range(2, 0))
            .to.eql([]);
    });
});