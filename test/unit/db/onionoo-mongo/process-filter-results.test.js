/* global describe, it */

var expect = require('expect.js');

describe('process-filter-results', function () {
    var processFilterResults = require('../../../../src/lib/db/onionoo-mongo/process-filter-results');
    expect(processFilterResults).to.be.ok();
});