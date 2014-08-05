/* global describe, it */

var expect = require('expect.js');

describe('process-group-results', function () {
    var processGroupResults = require('../../../../src/lib/db/onionoo-mongo/process-group-results');
    expect(processGroupResults).to.be.ok();
});
