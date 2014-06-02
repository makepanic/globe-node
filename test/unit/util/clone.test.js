/* global describe, it */

var expect = require('expect.js');

describe('clone', function () {
    var clone = require('../../../src/lib/util/clone');

    it('tests basic clone', function () {
        expect(clone({
            foo: 'foo'
        })).to.eql({
                foo: 'foo'
            });
    });

    it('tests that modifications to clone don\'t propagade', function () {
        var initial = {
                num: 0
            },
            cloned = clone(initial);

        cloned.num++;

        expect(initial).not.to.eql(cloned);
        expect(cloned.num).to.be(1);
        expect(initial.num).to.be(0);
    });
});