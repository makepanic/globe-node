/* global describe, it */

var expect = require('expect.js');

describe('familyToFingerprint', function () {
    var groupFlagList = require('../../../src/lib/util/formatter').groupFlagList;
    it('tests with valid values', function () {
        expect(groupFlagList({
            hasGroupCountry: true,
            hasGroupAs: true,
            hasGroupContact: true,
            hasGroupFamily: true
        })).to.be('country as number contact family');
    });
    it('tests with invalid values', function () {
        expect(groupFlagList(false)).to.be('');
        expect(groupFlagList({
            hasGroupContact: false
        })).to.be('');
    });
});
