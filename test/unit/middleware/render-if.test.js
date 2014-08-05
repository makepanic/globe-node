/* global describe, it */

var expect = require('expect.js'),
    sinon = require('sinon');

describe('render-if', function () {
    var renderIf = require('../../../src/lib/middleware/render-if');
    var VIEW_NAME = 'this-will-render';

    it('tests renderIf with a checkFn that returns true', function () {
        var renderTrue = renderIf(sinon.stub().returns(true), VIEW_NAME),
            spy = sinon.spy();

        renderTrue(null, {
            render: spy
        });

        expect(spy.calledWith(VIEW_NAME)).to.be(true);
    });
    it('tests renderIf with a checkFn that returns false', function () {
        var renderTrue = renderIf(sinon.stub().returns(false), VIEW_NAME),
            nextSpy = sinon.spy(),
            renderSpy = sinon.spy();

        renderTrue(null, {
            render: renderSpy
        }, nextSpy);

        expect(renderSpy.called).to.be(false);
        expect(nextSpy.called).to.be(true);
    });
    it('tests that a data function is called', function () {
        var dataSpy = sinon.spy(),
            nextSpy = sinon.spy(),
            renderSpy = sinon.spy(),
            renderTrue = renderIf(sinon.stub().returns(true), VIEW_NAME, dataSpy);

        renderTrue(null, {
            render: renderSpy
        }, nextSpy);

        expect(dataSpy.called).to.be(true);
    });
});
