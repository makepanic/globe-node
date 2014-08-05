/* global describe, it */

var expect = require('expect.js');

describe('bandwidth', function () {
    var bandwidth = require('../../../src/lib/util/formatter').bandwidth;
    var dataEmpty = '';

    it('tests with invalid values', function () {
        expect(bandwidth(null)).to.be(dataEmpty);
        expect(bandwidth(undefined)).to.be(dataEmpty);
        expect(bandwidth(-1)).to.be(dataEmpty);
        expect(bandwidth(NaN)).to.be(dataEmpty);
        expect(bandwidth('string')).to.be(dataEmpty);
    });

    it('tests with valid values', function () {
        expect(bandwidth(0))
            .to.be('0 B/s');
        expect(bandwidth(1.5))
            .to.be('1 B/s');
        expect(bandwidth(1))
            .to.be('1 B/s');
        expect(bandwidth(1000))
            .to.be('1 kB/s');
        expect(bandwidth(1234))
            .to.be('1.23 kB/s');
        expect(bandwidth(1000000))
            .to.be('1 MB/s');
    });
});
