/* global describe, it */

var expect = require('expect.js'),
    sinon = require('sinon');

describe('featureFlags', function () {
    var featureFlags = require('../../../src/lib/middleware/feature-flags');

    it('tests that no features are set by a request without a defined feature', function () {
        var middleware = featureFlags({
                FEAT_1: true
            }),
            req = {
                param: sinon.stub().returns('F1')
            },
            next = sinon.spy();

        middleware(req, null, next);

        expect(next.called).to.be.ok();
        expect(req).to.have.property('features');
        expect(req.features).to.eql({
            FEAT_1: true
        });
    });

    it('tests that a defined feature is changed by a request', function () {
        var middleware = featureFlags({
                F1: false
            }),
            req = {
                param: sinon.stub().returns('F1')
            },
            next = sinon.spy();

        middleware(req, null, next);

        expect(next.called).to.be.ok();
        expect(req).to.have.property('features');
        expect(req.features).to.eql({
            F1: true
        });
    });
});
