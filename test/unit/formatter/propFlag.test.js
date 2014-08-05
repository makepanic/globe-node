/* global describe, it */

var expect = require('expect.js');

describe('propFlag formatter', function() {
    var propFlag = require('../../../src/lib/util/formatter').propFlag;

    it('tests with valid values', function() {
        expect(propFlag('Fast')).to.be('<span class="fa fa-bolt" title="Fast"></span>');
        expect(propFlag('Running')).to.be('<span class="fa fa-code-fork" title="Running"></span>');
        expect(propFlag('BadExit')).to.be('<span class="fa fa-warning" title="BadExit"></span>');
        expect(propFlag('Authority')).to.be('<span class="fa fa-user-md" title="Authority"></span>');
        expect(propFlag('Guard')).to.be('<span class="fa fa-shield" title="Guard"></span>');
        expect(propFlag('HSDir')).to.be('<span class="fa fa-book" title="HSDir"></span>');
        expect(propFlag('Named')).to.be('<span class="fa fa-info" title="Named"></span>');
        expect(propFlag('Stable')).to.be('<span class="fa fa-anchor" title="Stable"></span>');
        expect(propFlag('V2Dir')).to.be('<span class="fa fa-folder" title="V2Dir"></span>');
        expect(propFlag('Valid')).to.be('<span class="fa fa-check" title="Valid"></span>');
        expect(propFlag('Unnamed')).to.be('<span class="fa fa-question" title="Unnamed"></span>');
        expect(propFlag('Exit')).to.be('<span class="fa fa-sign-out" title="Exit"></span>');
    });

    it('tests with invalid values', function () {
        expect(propFlag('Foo')).to.be('');
        expect(propFlag(null)).to.be('');
    });
});
