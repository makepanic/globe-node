/* global describe, it, before, after */

var logger = require('../../../logger'),
    expect = require('expect.js'),
    connection = require('../../../src/lib/db/connection'),
    filter = require('../../../src/lib/db/onionoo-mongo/filter'),
    testConfig = require('../config'),
    sinon = require('sinon'),
    request = require('request'),
    _ = require('lodash-node'),
    RSVP = require('rsvp');

var testFixture = {
    'bridges_published': '2012-11-16 21:00:00',
    'bridges': [],
    'relays_published': '2012-11-16 21:00:00',
    'relays': _.range(1200).map(function (e, i) {
        return {
            'nickname': 'nick' + i,
            'fingerprint': 'fp' + i,
            'or_addresses': ['1.2.3.4:443'],
            'dir_address': '1.2.3.4:9030',
            'running': true,
            'flags': ['Fast'],
            'country': 'de',
            'latitude': 51.000000,
            'longitude': 9.000000,
            'country_name': 'Germany',
            'as_number': 'as123',
            'as_name': 'asname',
            'consensus_weight': 0,
            'host_name': 'example.com',
            'advertised_bandwidth_fraction': 0,
            'consensus_weight_fraction': 0,
            'guard_probability': 0,
            'middle_probability': 0,
            'exit_probability': 0,
            'exit_policy_summary': {
                'reject': ['1']
            },
            'last_restarted': '2012-10-26 22:15:33',
            'bandwidth_rate': 0,
            'bandwidth_burst': 0,
            'observed_bandwidth': 0,
            'advertised_bandwidth': 0,
            'exit_policy': [
                'reject *:*'
            ],
            'contact': '',
            'platform': ''
        };
    })
};

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

describe('connection tests @db @imp', function () {
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

    it('fails to reload if the database isn\'t connected', function (done) {
        connection.reloadData().then(function () {
            expect().fail();
            done();
        }, function (err) {
            expect(err).to.be.ok();
            done();
        });
    });
//
    it('connects to the database', function (done) {
        var that = this,
            dbUrl = testConfig.DB.URL + '_connection_test';

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

    it('tests the behavior of filter while reloading data', function (done) {
        /*
         This test calls filter functions in specific intervals and starts to reload the database.
         It expects that the filter result is either the valid result or an error
         that is thrown if the database is locked.
         */
        var collections = this.collections;

        /**
         * Function that calls the filter function after a given timeout
         * @param {Object} collections Mongodb collections to pass to filter
         * @param {Object} opts Filter options
         * @param {Number} timeout Timeout
         * @return {exports.Promise} Promise that resolves after the given timeout by calling filter
         */
        function filterLater(collections, opts, timeout) {
            return new RSVP.Promise(function (resolve) {
                setTimeout(function () {
                    resolve(filter(collections, opts));
                }, timeout);
            });
        }

        /**
         * Function that returns the given parameter.
         * It's used to handle thrown errors while filtering.
         * @param {*} data Input
         * @return {*} Input
         */
        function through(data) {
            return data;
        }


        expect(connection.isLocked()).to.be(false);
        RSVP.hash({
            filter: RSVP.all([
                filter(collections, {}).then(through, through),
                filterLater(collections, {}, 1).then(through, through),
                filterLater(collections, {}, 7).then(through, through),
                filterLater(collections, {}, 14).then(through, through),
                filterLater(collections, {}, 21).then(through, through),
                filterLater(collections, {}, 28).then(through, through),
                filterLater(collections, {}, 35).then(through, through),
                filterLater(collections, {}, 42).then(through, through),
                filterLater(collections, {}, 49).then(through, through),
                filterLater(collections, {}, 56).then(through, through)
            ]),
            reload: connection.reloadData()
        }).then(function (data) {
            // test that all filter responses have the expected length
            data.filter.forEach(function (filterResult) {
                if (filterResult.dbLocked) {
                    // result had locked db reject
                    expect(filterResult.dbLocked).to.be(true);
                } else {
                    expect(filterResult.numRelays).to.be(testFixture.relays.length);
                }
            });
            done();
        }, function (err) {
            expect().fail(err);
            done();
        });
    });
});
