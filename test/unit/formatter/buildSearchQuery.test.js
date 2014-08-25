/* global describe, it */

var expect = require('expect.js');

describe('formatter.buildSearchQuery', function () {
    var buildSearchQuery = require('../../../src/lib/util/formatter').buildSearchQuery;
    it('tests with empty params', function () {
        expect(buildSearchQuery({}, {})).to
            .be('/search-compass?limit=10');
    });
    it('tests with query', function () {
        expect(buildSearchQuery({}, {}, 'test')).to
            .be('/search-compass?limit=10&query=test');
    });
    it('tests with group', function () {
        /* eslint camelcase: 0 */
        expect(buildSearchQuery({hasGroupFamily: true}, {family: [['testFamily', 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test&family=testFamily');
        expect(buildSearchQuery({hasGroupAS: true}, {as_number: [['1234', 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test&as=1234');
        expect(buildSearchQuery({hasGroupCountry: true}, {country: [['de', 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test&country=de');
        expect(buildSearchQuery({hasGroupContact: true}, {contact: [['test@example.org', 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test&contact=test@example.org');
    });
    it('tests with null value groups', function () {
        /* eslint camelcase: 0 */
        expect(buildSearchQuery({hasGroupFamily: true}, {family: [[null, 2]]})).to
            .be('/search-compass?limit=10');
        expect(buildSearchQuery({hasGroupAS: true}, {as_number: [[null, 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test');
        expect(buildSearchQuery({hasGroupCountry: true}, {country: [[null, 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test');
        expect(buildSearchQuery({hasGroupContact: true}, {contact: [[null, 2]]}, 'test')).to
            .be('/search-compass?limit=10&query=test');
    });
});
