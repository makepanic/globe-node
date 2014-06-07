/* global describe, it, before, after */

var testFixture = require('../../fixtures/compass-testdata.json'),
    connection = require('../../../src/lib/db/connection'),
    group = require('../../../src/lib/db/onionoo-mongo/group'),
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

describe('database group @db', function () {
    before(function (done) {
        // stub request.get to return the testFixture
        sinon.stub(request, 'get').yields(null, {
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
            expect(conn.collections).to.be.ok();
            that.collections = conn.collections;
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
            expect(Object.keys(result.displayed.relays[0].country)).to.eql(['us']);
            expect(Object.keys(result.displayed.relays[1].country)).to.eql(['de']);
            expect(Object.keys(result.displayed.relays[2].country)).to.eql(['nl']);
            expect(Object.keys(result.displayed.relays[3].country)).to.eql(['ca']);
            expect(Object.keys(result.displayed.relays[4].country)).to.eql(['ru']);
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
            expect(result.displayed.relays.length).to.be(10);
            expect(Object.keys(result.displayed.relays[0].as_number)).to.eql(['AS2914']);
            expect(Object.keys(result.displayed.relays[1].as_number)).to.eql(['AS24940']);
            expect(Object.keys(result.displayed.relays[2].as_number)).to.eql(['AS3']);
            expect(Object.keys(result.displayed.relays[3].as_number)).to.eql(['AS8737']);
            expect(Object.keys(result.displayed.relays[4].as_number)).to.eql(['AS30186']);
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