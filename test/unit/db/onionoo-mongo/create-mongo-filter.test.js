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

    it('tests with an running filter', function () {
        expect(createMongoFilter({
            running: false
        })).to.eql({
                running: false
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

    it('tests query', function () {
        expect(createMongoFilter({
            query: '$0000000000000000000000000000000000000000'
        })).to.eql({
                fingerprint: '0000000000000000000000000000000000000000'
            });
    });
    it('tests non family query', function () {
        var filter = createMongoFilter({
            query: 'Some Query'
        });

        filter.$or.forEach(function (or) {
            var keyName = Object.keys(or)[0];
            switch (keyName) {
                case 'nickname':
                    expect(or.nickname.$regex.toString()).to.be('/.*some query.*/');
                    break;
                case 'fingerprint':
                    expect(or.fingerprint.$regex.toString()).to.be('/^SOME QUERY/');
                    break;
                case 'or_addresses':
                    expect(or.or_addresses.$elemMatch.$regex.toString()).to.be('/^some query/');
                    break;
                case 'exit_addresses':
                    expect(or.exit_addresses.$elemMatch.$regex.toString()).to.be('/^some query/');
                    break;
            }
        });
    });
});
