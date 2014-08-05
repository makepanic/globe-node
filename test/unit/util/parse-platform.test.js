/* global describe, it */

var expect = require('expect.js');

describe('extract-os', function () {
    var parsePlatform = require('../../../src/lib/util/parse-platform');

    it('tests with invalid data', function () {
        expect(parsePlatform.bind('')).to.throwError();
        expect(parsePlatform.bind('#asdlaäsölaŧ←↓→←↓ø')).to.throwError();
        expect(parsePlatform.bind('Tor aaaa on Windows 8  [server]')).to.throwError();
    });

    it('tests linux extract', function () {
        expect(parsePlatform('Tor 0.2.2.39 (git-bec76476efb71549) on Windows 7 Service Pack 1 [workstation]')).to.eql({
            os: 'Windows',
            version: '7 Service Pack 1',
            tor: '0.2.2.39',
            client: 'Tor',
            git: 'bec76476efb71549',
            arch: undefined,
            meta: '[workstation]',
            osString: 'Windows 7 Service Pack 1'
        });
        expect(parsePlatform('Tor 0.2.2.39 (git-bec76476efb71549) on Windows 8  [server]')).to.eql({
            os: 'Windows',
            version: '8',
            tor: '0.2.2.39',
            git: 'bec76476efb71549',
            client: 'Tor',
            arch: undefined,
            meta: '[server]',
            osString: 'Windows 8'
        });
        expect(parsePlatform('Tor 0.2.4.21 on Windows 2000 Service Pack 4 [server] {enterprise} {terminal services, single user} {terminal services}')).to.eql({
            os: 'Windows',
            client: 'Tor',
            tor: '0.2.4.21',
            version: '2000 Service Pack 4',
            git: undefined,
            arch: undefined,
            osString: 'Windows 2000 Service Pack 4',
            meta: '[server] {enterprise} {terminal services, single user} {terminal services}'
        });
        expect(parsePlatform('Tor 0.2.3.25 on Windows 7')).to.eql({
            os: 'Windows',
            client: 'Tor',
            tor: '0.2.3.25',
            version: '7',
            osString: 'Windows 7',
            git: undefined,
            arch: undefined,
            meta: undefined
        });
        expect(parsePlatform('Tor 0.2.3.25 on OpenBSD')).to.eql({
            os: 'OpenBSD',
            client: 'Tor',
            tor: '0.2.3.25',
            version: undefined,
            git: undefined,
            arch: undefined,
            osString: 'OpenBSD',
            meta: undefined
        });
    });

    it('tests linux extract', function () {
        expect(parsePlatform('node-Tor 0.1.0 on Linux x86_64')).to.eql({
            os: 'Linux',
            version: undefined,
            client: 'node-Tor',
            tor: '0.1.0',
            git: undefined,
            arch: 'x86_64',
            meta: undefined,
            osString: 'Linux x86_64'
        });
        expect(parsePlatform('Tor 0.2.3.24-rc on Linux')).to.eql({
            os: 'Linux',
            client: 'Tor',
            version: undefined,
            tor: '0.2.3.24-rc',
            git: undefined,
            osString: 'Linux',
            arch: undefined,
            meta: undefined
        });
        expect(parsePlatform('Tor 0.2.2.39 (git-2f7e71c2e896772f) on Linux x86_64')).to.eql({
            client: 'Tor',
            os: 'Linux',
            version: undefined,
            tor: '0.2.2.39',
            git: '2f7e71c2e896772f',
            arch: 'x86_64',
            osString: 'Linux x86_64',
            meta: undefined
        });
        expect(parsePlatform('Tor 0.2.2.35 (git-73ff13ab3cc9570d) on Linux i686')).to.eql({
            version: undefined,
            client: 'Tor',
            os: 'Linux',
            tor: '0.2.2.35',
            osString: 'Linux i686',
            git: '73ff13ab3cc9570d',
            arch: 'i686',
            meta: undefined
        });
        expect(parsePlatform('Tor 0.2.2.39 (git-bec76476efb71549) on Linux x86_64')).to.eql({
            version: undefined,
            client: 'Tor',
            os: 'Linux',
            tor: '0.2.2.39',
            git: 'bec76476efb71549',
            osString: 'Linux x86_64',
            arch: 'x86_64',
            meta: undefined
        });
    });
});
