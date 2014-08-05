/* global describe, it */

var expect = require('expect.js');

describe('handle-sort-undefined', function () {
    var handleSortUndefined = require('../../../src/lib/util/handle-sort-undefined');

    it('tests with sorted undefined array', function () {
        expect(handleSortUndefined(['1.0', '1.1', '2.0', undefined, undefined])).to.eql([undefined, undefined, '1.0', '1.1', '2.0']);
        expect(handleSortUndefined(['1.0', '1.1', '2.0'])).to.eql(['1.0', '1.1', '2.0']);
        expect(handleSortUndefined([])).to.eql([]);
    });
});
