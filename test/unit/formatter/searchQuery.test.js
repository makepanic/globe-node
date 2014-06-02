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
});