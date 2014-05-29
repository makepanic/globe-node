/* global describe, it, beforeEach */

var expect = require('expect.js'),
    sinon = require('sinon');

describe('normalize-query', function () {
    var normalizeQuery = require('../../../src/lib/middleware/normalize-query');

    beforeEach(function (done) {
        this.next = sinon.spy();
        done();
    });

    it('tests the normalizer', function () {
        var middleware = normalizeQuery({
                checkbox: ['checkOn', 'checkOff', 'checkMisc'],
                boolean: ['strBoolTrue', 'strBoolFalse', 'boolTrue', 'boolFalse', 'boolMisc'],
                empty: ['filledField', 'emptyField', 'miscField'],
                integer: ['int1', 'int2', 'intStr', 'intMisc']
            }),
            req = {
                query: {
                    checkOn: 'on',
                    checkOff: '',
                    boolTrue: true,
                    boolFalse: false,
                    strBoolTrue: 'true',
                    strBoolFalse: 'false',
                    filledField: 'filled',
                    emptyField: '',
                    int1: '10',
                    int2: '-10',
                    intStr: 'foobar'
                }
            };

        middleware(req, null, this.next);

        expect(req.query.checkOn).to.be(true);
        expect(req.query.checkOff).to.be(false);
        expect(req.query.checkMisc).to.be(null);

        expect(req.query.boolTrue).to.be(true);
        expect(req.query.boolFalse).to.be(false);
        expect(req.query.strBoolTrue).to.be(true);
        expect(req.query.strBoolFalse).to.be(false);
        expect(req.query.boolMisc).to.be(null);

        expect(req.query.filledField).to.be('filled');
        expect(req.query.emptyField).to.be(null);
        expect(req.query.miscField).to.be(null);

        expect(req.query.int1).to.be(10);
        expect(req.query.int2).to.be(-10);
        expect(req.query.intStr).to.be(null);
        expect(req.query.intMisc).to.be(null);

        expect(this.next.called).to.be(true);
    });
});