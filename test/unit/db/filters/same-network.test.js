/* global describe, it */
/* eslint camelcase: 0 */

var expect = require('expect.js');

describe('same-network', function () {
    var sameNetwork = require('../../../../src/lib/db/filters/same-network');

    it('tests with empty values', function () {
        expect(sameNetwork([], 2))
            .to.eql([]);
    });

    it('tests with ipv6 adress', function () {
        expect(sameNetwork([
            {
                or_addresses: ['2001:db8:85a3::8a2e:370:7334']
            }
        ], 2)).to.eql([]);
    });

    it('tests with ipv4 adress', function () {
        expect(sameNetwork([
            {
                or_addresses: ['127.0.0.1']
            }
        ], 2))
            .to.eql([
                {
                    or_addresses: ['127.0.0.1']
                }
            ]);
    });
    it('tests with multiple ipv4 or_addresses in the same relay', function () {
        expect(sameNetwork([
            {
                fingerprint: '0000000000000000000000000000000000000000',
                or_addresses: ['127.0.0.1', '0.0.0.1']
            }
        ], 2))
            .to.eql([
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.1', '0.0.0.1']
                }
            ]);
    });

    describe('under max per same network', function () {
        it('tests with multiple ipv4 addresses', function () {
            expect(sameNetwork([
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.1'],
                    exit_probability: 0.0003,
                    consensus_weight_fraction: 0.0001
                },
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.2'],
                    exit_probability: 0.0002,
                    consensus_weight_fraction: 0.0002
                }
            ], 2))
                .to.eql([
                    {
                        fingerprint: '0000000000000000000000000000000000000000',
                        or_addresses: ['127.0.0.1'],
                        exit_probability: 0.0003,
                        consensus_weight_fraction: 0.0001
                    },
                    {
                        fingerprint: '0000000000000000000000000000000000000000',
                        or_addresses: ['127.0.0.2'],
                        exit_probability: 0.0002,
                        consensus_weight_fraction: 0.0002
                    }
                ]);
        });
    });
    describe('over max per same network', function () {
        it('tests with multiple ipv4 addresses', function () {
            expect(sameNetwork([
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.1'],
                    exit_probability: 0.0003,
                    consensus_weight_fraction: 0.0001
                },
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.2'],
                    exit_probability: 0.0002,
                    consensus_weight_fraction: 0.0003
                },
                {
                    fingerprint: '0000000000000000000000000000000000000000',
                    or_addresses: ['127.0.0.3'],
                    exit_probability: 0.0004,
                    consensus_weight_fraction: 0.0002
                }
            ], 2))
                .to.eql([
                    {
                        fingerprint: '0000000000000000000000000000000000000000',
                        or_addresses: ['127.0.0.1'],
                        exit_probability: 0.0003,
                        consensus_weight_fraction: 0.0001
                    },
                    {
                        fingerprint: '0000000000000000000000000000000000000000',
                        or_addresses: ['127.0.0.3'],
                        exit_probability: 0.0004,
                        consensus_weight_fraction: 0.0002
                    }
                ]);
        });
    });
});