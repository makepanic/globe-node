/* global describe, it, beforeEach */
/* eslint camelcase: 0 */

var expect = require('expect.js'),
    sinon = require('sinon');

describe('process-filter-results', function () {
    var processFilterResults = require('../../../../src/lib/db/onionoo-mongo/process-filter-results');

    beforeEach(function (done) {
        this.failHandler = sinon.spy();
        done();
    });

    it('tests processing of filter results with empty values', function (done) {
        var failHandler = this.failHandler;
        processFilterResults({}).then(function (filterResult) {
            expect(filterResult).to.eql({
                notDisplayed: {
                    relays: {
                        number: 0,
                        consensus_weight_fraction: 0,
                        advertised_bandwidth_fraction: 0,
                        guard_probability: 0,
                        middle_probability: 0,
                        exit_probability: 0
                    },
                    bridges: {}
                },
                displayed: {
                    relays: [],
                    bridges: []
                },
                numBridges: 0,
                numRelays: 0
            });
            expect(failHandler.called).to.be(false);
            done();
        }, failHandler);

    });
});