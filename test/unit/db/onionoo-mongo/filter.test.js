/* global describe, it */

var expect = require('expect.js');

describe('filter', function () {
    var filter = require('../../../../src/lib/db/onionoo-mongo/filter');
    expect(filter).to.be.ok();
});