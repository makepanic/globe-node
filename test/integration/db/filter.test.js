/* global describe, it, before, after */

var speeds = require('../../../src/lib/db/onionoo-mongo/speeds'),
    testFixture = require('../../fixtures/compass-testdata.json'),
    connection = require('../../../src/lib/db/connection'),
    filter = require('../../../src/lib/db/onionoo-mongo/filter'),
    testConfig = require('../config'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    request = require('request');

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

describe('database filter @db', function () {
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
            dbUrl = testConfig.DB.URL + '_filter_test';

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
        filter(this.collections, {
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

    it('tests with an os filter (windows)', function (done) {
        filter(this.collections, {
            filter: {
                os: ['Windows']
            }
        }).then(function (result) {
            result.displayed.relays.forEach(function (relay) {
                expect(relay.platform).to.contain('Windows');
            });
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with an os filter (linux)', function (done) {
        filter(this.collections, {
            filter: {
                os: ['Linux']
            }
        }).then(function (result) {
            result.displayed.relays.forEach(function (relay) {
                expect(relay.platform).to.contain('Linux');
            });
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with no filter fields', function (done) {
        filter(this.collections).then(function (result) {
            expect(result.displayed.relays.length).to.be(10);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with display limit', function (done) {
        filter(this.collections, {
            displayAmount: 5
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(5);
            expect(result.notDisplayed.relays.number).to.be(5);
            done();
        }, function (err) {
            done(err);
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with an known as (AS7922)', function (done) {
        filter(this.collections, {
            filter: {
                as: 'AS7922'
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(1);
            expect(result.displayed.relays[0].nickname).to.be('Tornearse');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with filter limit=3', function (done) {
        filter(this.collections, {
            displayAmount: 3
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(3);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('tests with filter exitspeed FAST_EXIT', function (done) {
        filter(this.collections, {
            filter: {
                exitSpeed: 'FAST_EXIT'
            }
        }).then(function (result) {
            expect(result.displayed.relays.length).to.be(1);
            expect(result.displayed.relays[0].nickname).to.be('AkamaiTor2');
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
