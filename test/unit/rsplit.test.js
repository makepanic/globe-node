/* global describe, it */

var expect = require('expect.js');

describe('rsplit', function() {
    var rsplit = require('../../src/lib/util/rsplit');

    it('tests with valid values', function() {
        // taken from http://www.dotnetperls.com/split-python
        expect(rsplit('Buffalo;Rochester;Yonkers;Syracuse;Albany;Schenectady', ';', 3))
            .to.eql(['Buffalo;Rochester;Yonkers', 'Syracuse', 'Albany', 'Schenectady']);

        expect(rsplit('Foo;Bar;Baz'))
            .to.eql(['Foo;Bar;Baz']);
    });
});
