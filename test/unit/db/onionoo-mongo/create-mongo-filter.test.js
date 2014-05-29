/* global describe, it */
/* eslint camelcase: 0 */

var expect = require('expect.js');

describe('create-mongo-filter', function () {
    var speed = require('../../../../src/lib/db/onionoo-mongo/speeds'),
        createMongoFilter = require('../../../../src/lib/db/onionoo-mongo/create-mongo-filter');

    it('tests with an empty filter', function () {
        expect(createMongoFilter({})).to.eql({});
    });

    it('tests with unrelated properties set filter', function () {
        expect(createMongoFilter({
            foo: 'bar',
            a: undefined
        })).to.eql({});
    });

    it('tests with an inactive filter', function () {
        expect(createMongoFilter({
            inactive: false
        })).to.eql({
            running: true
        });
    });

    describe('exitSpeed', function () {
        it('tests with an exitSpeed FAST_EXIT filter', function () {
            expect(createMongoFilter({
                exitSpeed: speed.FAST_EXIT
            })).to.eql({
                advertised_bandwidth: {
                    $gt: 5120000
                },
                bandwidth_rate: {
                    $gt: 12160000
                }
            });
        });

        it('tests with an exitSpeed ALMOST_FAST_EXIT filter', function () {
            expect(createMongoFilter({
                exitSpeed: speed.ALMOST_FAST_EXIT
            })).to.eql({
                advertised_bandwidth: {
                    $gt: 2048000,
                    $lt: 5120000
                },
                bandwidth_rate: {
                    $gt: 10240000,
                    $lt: 12160000
                }
            });
        });
    });

    it('tests simple fields', function () {
        expect(createMongoFilter({
            country: 'de'
        })).to.eql({
            country: 'de'
        });

        expect(createMongoFilter({
            as: '123'
        })).to.eql({
            as_number: '123'
        });

        expect(createMongoFilter({
            exit: true
        })).to.eql({
            exit_probability: {
                $gt: 0
            }
        });

        expect(createMongoFilter({
            exit: null
        })).to.eql({});

        expect(createMongoFilter({
            family: '0000000000000000000000000000000000000000'
        })).to.eql({
            family: '$0000000000000000000000000000000000000000'
        });
    });
});