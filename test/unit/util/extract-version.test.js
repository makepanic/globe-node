/* global describe, it */

var expect = require('expect.js');

describe('extract-version', function () {
    var extractVersion = require('../../../src/lib/util/extract-version');

    it('test with different versions', function () {
        expect(extractVersion('0.2.2.39')).to.eql({
            major: 0,
            minor: 2,
            build: 2,
            revision: '39'
        });
        expect(extractVersion('0.2.3.25')).to.eql({
            major: 0,
            minor: 2,
            build: 3,
            revision: '25'
        });
    });
});
