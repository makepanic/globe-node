/* global describe, it, beforeEach */

var expect = require('expect.js'),
    sinon = require('sinon');

describe('handle404', function () {
    var handle404 = require('../../../src/lib/middleware/handle404')();

    beforeEach(function (done) {
        this.status = sinon.spy();
        this.accept = sinon.spy();
        this.render = sinon.spy();
        this.send = sinon.spy();

        done();
    });

    it('tests if it sends txt if no user accepts', function () {
        var type = sinon.stub().withArgs('txt').returns({
            send: this.send
        });

        handle404({
            accepts: this.accept
        }, {
            status: this.status,
            render: this.render,
            type: type
        });

        expect(this.status.calledWith(404)).to.be(true);
        expect(type.calledWith('txt')).to.be(true);
        expect(this.send.calledWith('Resource not found')).to.be(true);
    });

    it('tests if it renders html if user accepts', function () {
        var accept = sinon.stub().withArgs('html').returns(true);

        handle404({
            accepts: accept
        }, {
            status: this.status,
            render: this.render
        });

        expect(this.status.calledWith(404)).to.be(true);
        expect(this.render.calledWith('error', {
            title: 404,
            msg: 'Resource not found'
        })).to.be(true);
    });

    it('tests if it sends json if user accepts', function () {
        var accept = sinon.stub();

        accept.withArgs('json').returns(true);
        accept.returns(false);

        handle404({
            accepts: accept
        }, {
            status: this.status,
            send: this.send
        });

        expect(this.status.calledWith(404)).to.be(true);
        expect(this.send.calledWith({
            error: 'Resource not found'
        })).to.be(true);
    });
});
