/* global describe, it */

var expect = require('expect.js');

describe('group', function () {
    var group = require('../../../../src/lib/db/onionoo-mongo/group');
    expect(group).to.be.ok();
});