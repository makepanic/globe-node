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
        var empties = {arr1: [1,2,3], arr2: [4,5,6]},
            middleware = normalizeQuery({
                checkbox: ['checkOn', 'checkOff', 'checkMisc'],
                boolean: ['strBoolTrue', 'strBoolFalse', 'boolTrue', 'boolFalse', 'boolMisc'],
                empty: ['filledField', 'emptyField', 'miscField'],
                integer: ['int1', 'int2', 'intStr', 'intMisc'],
                array: [
                    {param: 'arr1', defaultsTo: function(){ return empties.arr1; }},
                    {param: 'arr2', defaultsTo: function(){ return empties.arr2; }}
                ]
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
                    intStr: 'foobar',
                    arr1: []
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

        expect(req.normQuery.arr1).to.eql([1,2,3]);
        expect(req.normQuery.arr2).to.eql([4,5,6]);

        expect(this.next.called).to.be(true);
    });
});
