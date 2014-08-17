/* global describe, it, before, after */

var testFixture = require('../../fixtures/compass-testdata.json'),
    connection = require('../../../src/lib/db/connection'),
    group = require('../../../src/lib/db/onionoo-mongo/group'),
    testConfig = require('../config'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    request = require('request'),
    RSVP = require('rsvp');

function cleanCloseConnection(database, callback) {
    database.dropDatabase(function (err) {
        if (err) {
            throw err;
        }
        database.close(function (err) {
            if (err) {
                throw err;
            }
            callback();
        });
    });
}

describe('database group @db', function () {
    before(function (done) {
        // stub request.get to return the testFixture
        sinon.stub(request, 'get').yieldsAsync(null, {
            statusCode: 200
        }, JSON.stringify(testFixture));
        done();
    });
    after(function (done) {
        request.get.restore();
        cleanCloseConnection(this.database, function () {
            done();
        });
    });

    it('connects to the database', function (done) {
        var that = this,
            dbUrl = testConfig.DB.URL + '_group_test';

        connection.init({
            waitForReload: true,
            dbUrl: dbUrl
        }).then(function (conn) {
            expect(connection.getCollections()).to.be.ok();
            that.collections = connection.getCollections();
            that.database = conn.database;
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with an unknown as', function (done) {
        group(this.collections, {
            filter: {
                as: 'AS3320'
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(0);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with limited results', function (done) {
        group(this.collections, {
            group: {
                country: true
            },
            displayAmount: 2
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(2);
            expect(result.notDisplayed.relays.number).to.be(4);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with an known as (AS7922)', function (done) {
        group(this.collections, {
            filter: {
                as: 'AS7922'
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(1);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with group by country', function (done) {
        group(this.collections, {
            group: {
                country: true
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(6);
            expect(result.displayed.relays[0].country[0][0]).to.eql('us');
            expect(result.displayed.relays[1].country[0][0]).to.eql('de');
            expect(result.displayed.relays[2].country[0][0]).to.eql('nl');
            expect(result.displayed.relays[3].country[0][0]).to.eql('ca');
            expect(result.displayed.relays[4].country[0][0]).to.eql('ru');
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with group by as', function (done) {
        group(this.collections, {
            group: {
                as: true
            }
        }).then(function (result) {
            var mustContain = ['AS2914', 'AS24940', 'AS3', 'AS8737', 'AS16276', 'AS30186', 'AS7922', 'AS7385', 'AS21844', null];

            expect(result.displayed.relays.length).to.be(10);
            // loop through all as_numbers and remove the found one from the mustContain array
            result.displayed.relays.forEach(function (relay) {
                var itemIndex = mustContain.indexOf(relay.as_number[0][0]);
                expect(itemIndex >= 0).to.be.ok();
                // remove found item
                mustContain.splice(itemIndex, 1);
            });
            expect(mustContain.length).to.be(0);

            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with group by country and sortBy country', function (done) {
        RSVP.hash({
            noAsc: group(this.collections, {
                sortBy: 'country',
                group: {
                    country: true
                }
            }),
            asc: group(this.collections, {
                sortAsc: true,
                sortBy: 'country',
                group: {
                    country: true
                }
            })
        }).then(function (result) {
            expect(result.noAsc.displayed.relays.length).to.be(6);

            expect(result.noAsc.displayed.relays[0].country[0][0]).to.be('us');
            expect(result.noAsc.displayed.relays[5].country[0][0]).to.be(null);

            expect(result.asc.displayed.relays.length).to.be(6);
            expect(result.asc.displayed.relays[0].country[0][0]).to.be(null);
            expect(result.asc.displayed.relays[5].country[0][0]).to.be('us');
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with group by as and country', function (done) {
        group(this.collections, {
            group: {
                as: true,
                country: true
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(10);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });
});
