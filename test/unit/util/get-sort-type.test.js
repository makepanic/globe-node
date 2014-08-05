/* global describe, it */

var expect = require('expect.js');

describe('get sort type', function () {
    var getSortType = require('../../../src/lib/util/get-sort-type');

    it('tests some numeric types', function () {
        expect(getSortType('exit_probability')).to.be('numeric');
        expect(getSortType('consensus_weight_fraction')).to.be('numeric');
        expect(getSortType('advertised_bandwidth_fraction')).to.be('numeric');
    });

    it('tests some string types', function () {
        expect(getSortType('nickname')).to.be('string');
        expect(getSortType('fingerprint')).to.be('string');
        expect(getSortType('as_number')).to.be('string');
    });

    it('tests some invalid types', function () {
        var notFound;

        expect(getSortType(null)).to.be(notFound);
        expect(getSortType(undefined)).to.be(notFound);
        expect(getSortType(NaN)).to.be(notFound);
        expect(getSortType()).to.be(notFound);
        expect(getSortType('some_field')).to.be(notFound);
    });
});
