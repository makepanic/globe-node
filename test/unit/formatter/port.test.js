/* global describe, it */

var expect = require('expect.js');

describe('port formatter', function() {
    var port = require('../../../src/lib/util/formatter').port;

    it('tests with valid values', function() {
        expect(port('0.0.0.0:8080')).to.be('8080');
        expect(port('0.0.0.0:21')).to.be('21');
    });

    it('tests with invalid values', function() {
        var dataEmpty = '';
        expect(port(undefined)).to.be(dataEmpty);
        expect(port(null)).to.be(dataEmpty);
        expect(port(0)).to.be(dataEmpty);
        expect(port(NaN)).to.be(dataEmpty);
        expect(port('string')).to.be(dataEmpty);
        expect(port('0.0.0.0:80:80')).to.be(dataEmpty);
    });
});
