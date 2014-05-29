/* global describe, it */

var expect = require('expect.js');

describe('globalData', function() {
    var buildTitle = require('../../src/lib/globalData').buildTitle;

    it('tests the title builder', function() {
        expect(buildTitle([], '0.0.1')).to.be('Globe 0.0.1');
        expect(buildTitle(['foo'], '0.0.1')).to.be('foo | Globe 0.0.1');
        expect(buildTitle(['foo', 'bar'], '0.0.1')).to.be('foo | bar | Globe 0.0.1');
    });
});