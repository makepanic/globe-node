/* global describe, it */

var expect = require('expect.js');

describe('search query test', function () {
    var searchQuery = require('../../../src/lib/util/formatter').searchQuery;

    it('tests with valid values', function () {

        // make a query for the fingerprint column
        expect(searchQuery({
            sortBy: 'nickname',
            nickname: 'foo',
            sortAsc: true
        }, 'fingerprint')).to.be('sortBy=fingerprint&nickname=foo&sortAsc=false');

        // make query for the nickname column
        expect(searchQuery({
            sortBy: 'nickname',
            nickname: 'foo',
            sortAsc: true
        }, 'nickname')).to.be('sortBy=nickname&nickname=foo&sortAsc=false');
    });
    it('tests for tor array values', function () {
        expect(searchQuery({
            tor: ['0.1.0', '0.1.1', '0.2.0'],
            nickname: 'foo'
        }, 'fingerprint')).to.be('nickname=foo&sortBy=fingerprint&sortAsc=false&tor%5B%5D=0.1.0&tor%5B%5D=0.1.1&tor%5B%5D=0.2.0');
    });
    it('tests for os array values', function () {
        expect(searchQuery({
            os: ['Windows', 'Linux', 'OpenBSD'],
            nickname: 'foo'
        }, 'fingerprint')).to.be('nickname=foo&sortBy=fingerprint&sortAsc=false&os%5B%5D=Windows&os%5B%5D=Linux&os%5B%5D=OpenBSD');
    });
});
