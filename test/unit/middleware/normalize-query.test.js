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

        expect(req.normQuery.checkOn).to.be(true);
        expect(req.normQuery.checkOff).to.be(false);
        expect(req.normQuery.checkMisc).to.be(null);

        expect(req.normQuery.boolTrue).to.be(true);
        expect(req.normQuery.boolFalse).to.be(false);
        expect(req.normQuery.strBoolTrue).to.be(true);
        expect(req.normQuery.strBoolFalse).to.be(false);
        expect(req.normQuery.boolMisc).to.be(null);

        expect(req.normQuery.filledField).to.be('filled');
        expect(req.normQuery.emptyField).to.be(null);
        expect(req.normQuery.miscField).to.be(null);

        expect(req.normQuery.int1).to.be(10);
        expect(req.normQuery.int2).to.be(-10);
        expect(req.normQuery.intStr).to.be(null);
        expect(req.normQuery.intMisc).to.be(null);

        expect(this.next.called).to.be(true);
    });
});