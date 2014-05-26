/* eslint no-console:0 */

var MongoClient = require('mongodb').MongoClient,
    RSVP = require('rsvp'),
    getJSON = require('../onionoo/util/getJSON'),
    conf = require('./db-conf'),
    assert = require('assert');

var locked = false,
    database = null,
    collections = {};


/**
 * Function that indicates if the database is locked for access
 * @return {boolean} True if the database is locked
 */
function isLocked() {
    return locked;
}
/**
 * Function that allows to "lock" the database
 * @return {void}
 */
function lock() {
    locked = true;
    console.log('db locked');
}
/**
 * Function that allows to "unlock" the database
 * @return {void}
 */
function unlock() {
    locked = false;
    console.log('db unlocked');
}

/**
 * Function that removes all documents in all collections
 * @return {*} Promise that resolves after all collections are "cleared"
 */
function clearCollections() {
    console.log('removing old collections');

    return RSVP.all([
        RSVP.denodeify(collections.relays.remove.bind(collections.relays))(),
        RSVP.denodeify(collections.bridges.remove.bind(collections.bridges))()
    ]);
}

/**
 * Function that clears all collections, loads the onionoo dump and inserts the result
 * @return {exports.Promise} Promise that resolves after filling the database.
 */
function reloadData() {
    return new RSVP.Promise(function (resolve, reject) {
        console.log('Downloading details dump from onionoo. ' +
            'This could take a while, depending on your internet connection.');

        // load onionoo data
        getJSON('details').then(function (result) {
            console.log('Download completed.');

            // lock database before sync
            lock();

            // remove old collection if exists
            clearCollections().then(function () {
                var //result = dump,
                    insertPromises = [];

                // prepare data for easier later queries
                result.relays.forEach(function (relay) {
                    var target = relay.exit_policy_summary.accept ? 'accept' : 'reject';

                    relay.exit_policy_summary['_' + target] = [];
                    relay.exit_policy_summary['_' + target + '_range'] = [];

                    relay.exit_policy_summary[target].forEach(function (portRange) {
                        var range = portRange.split('-');

                        if (range.length === 2) {
                            // is port range
                            var start = parseInt(range[0], 10),
                                end = parseInt(range[1], 10);

                            relay.exit_policy_summary['_' + target + '_range'].push({
                                start: start,
                                end: end
                            });
                        } else {
                            relay.exit_policy_summary['_' + target].push(parseInt(portRange, 10));
                        }
                    });
                });

                if (result.relays.length) {
                    insertPromises.push(RSVP.denodeify(collections.relays.insert.bind(collections.relays))(result.relays, {}));
                }
                if (result.bridges.length) {
                    insertPromises.push(RSVP.denodeify(collections.bridges.insert.bind(collections.bridges))(result.bridges, {}));
                }

                RSVP.all(insertPromises).then(function () {
                    console.log('Insert completed.');

                    // unlock database after sync
                    unlock();

                    // resolve with database and created collection
                    resolve();

                }, function (err) {
                    reject(err);
                });
            });
        }, function (err) {
            console.error(err);
            reject(err);
        });
    });
}


/**
 * Function that connects to the database and populates it.
 * @return {exports.Promise} Promise that resolves after connecting to the database and creating the required structures.
 * @param {Object} opts Configuration object
 */
function init(opts) {
    var skipReloadData = opts.skipReload,
        dbUrl = opts.dbUrl;

    assert(typeof dbUrl === 'string', 'Expected a database url.');

    return new RSVP.Promise(function (resolve, reject) {
        console.log('connecting to mongodb');

        // connect to db
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            database = db;

            // create collections for relays and bridges
            RSVP.hash({
                relays: RSVP.denodeify(database.createCollection.bind(database))('relays'),
                bridges: RSVP.denodeify(database.createCollection.bind(database))('bridges')
            }).then(function (createdCollections) {

                collections = createdCollections;

                var resolveData = {
                    isLocked: isLocked,
                    collections: createdCollections
                };

                if (!skipReloadData) {
                    // Lock the database and start the initial onionoo data loading.
                    // We don't wait for it to complete and resolve immediately.
                    lock();
                    reloadData();
                }
                resolve(resolveData);
            });
        });
    });
}

/**
 * Function that creates an interval that reloads the database structure + onionoo dump
 * @return {void}
 */
function initSyncTask() {
    console.log('init sync task');
    setTimeout(function syncTimeout() {
        console.log('initSyncTask reload Data');
        reloadData().then(function () {
            initSyncTask();
        });
    }, conf.syncInterval);
}

module.exports = {
    init: init,
    initSyncTask: initSyncTask,
    lock: lock,
    unlock: unlock,
    isLocked: isLocked
};