/* eslint no-console:0 */

var logger = require('../../../logger'),
    MongoClient = require('mongodb').MongoClient,
    RSVP = require('rsvp'),
    globalData = require('../global-data'),
    getJSON = require('../onionoo/util/get-JSON'),
    parsePlatform = require('../util/parse-platform'),
    conf = require('../../../config'),
    assert = require('assert'),
    _ = require('lodash-node'),
    retry = require('qretry');

var locked = false,
    database = null,
    collections = {},
    currentUpdateStarted = -1,
    updateDurations = [];

function remainingUpdateDuration() {
    if (updateDurations.length === 0) {
        // return 0 if no duration was stored (initial update)
        return 0;
    }
    var allDurations = _.reduce(updateDurations, function (sum, duration) {
            return sum + duration;
        }),
        avgDuration = allDurations / updateDurations.length;

    return avgDuration - (Date.now() - currentUpdateStarted);
}

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
    logger.info('db locked');
}
/**
 * Function that allows to "unlock" the database
 * @return {void}
 */
function unlock() {
    locked = false;
    logger.info('db unlocked');
}

/**
 * Function that removes all documents in all collections
 * @return {*} Promise that resolves after all collections are "cleared"
 */
function clearCollections() {
    return RSVP.all([
        RSVP.denodeify(collections.relays.remove.bind(collections.relays))(),
        RSVP.denodeify(collections.bridges.remove.bind(collections.bridges))()
    ]);
}

function isReadyToClearAndInsert() {
    return new RSVP.Promise(function (resolve, reject) {
        database.collection('$cmd.sys.inprog').findOne(function (err, data) {
            if (err) {
                throw err;
            }
            if (data.inprog.length) {
                // reject if there are any running commands
                reject();
            } else {
                resolve();
            }
        });
    });
}

/**
 * Function that clears all collections, loads the onionoo dump and inserts the result
 * @return {exports.Promise} Promise that resolves after filling the database.
 */
function reloadData() {
    return new RSVP.Promise(function (resolve, reject) {
        assert(!!database, 'To reload data the database has to exist');

        var downloadStarted = Date.now();
        logger.info('Downloading details dump from onionoo. ' +
            'This could take a while, depending on your internet connection.');

        // load onionoo data
        getJSON('details').then(function (result) {
            // store time before dataset update
            currentUpdateStarted = Date.now();

            // add current download duration
            logger.info('Download finished. Took %s ms', Date.now() - downloadStarted);

            // set lock flag before sync
            lock();

            retry(isReadyToClearAndInsert).then(function () {

                // check if any
                // remove old collection if exists
                clearCollections().then(function () {
                    var //result = dump,
                        insertPromises = [],
                        osMap = {},
                        versions = {};

                    // prepare data for easier later queries
                    // result.relays.forEach(function(relay){
                    for (var relayIndex = 0; relayIndex < result.relays.length; relayIndex++) {
                        /* eslint camelcase:0 */
                        var relay = result.relays[relayIndex],
                            target = relay.exit_policy_summary.accept ? 'accept' : 'reject';

                        // extract os
                        if (relay.platform) {
                            try {
                                var parsedPlatform = parsePlatform(relay.platform);
                                relay.tor = parsedPlatform.tor;
                                relay.git = parsedPlatform.git;
                                relay.meta = parsedPlatform.meta;
                                relay.arch = parsedPlatform.arch;
                                relay.os = parsedPlatform.os;
                                relay.version = parsedPlatform.version;
                                relay.client = parsedPlatform.client;
                                relay.osString = parsedPlatform.osString;

                                // add array with null for group by family
                                relay.family = relay.family ? relay.family : [null];
                                // add null if no contact for group by contact
                                relay.contact = relay.contact ? relay.contact : null;
                                // add null if no contact for group by contact
                                relay.country = relay.country ? relay.country : null;
                                // add null if no contact for group by contact
                                relay.as_number = relay.as_number ? relay.as_number : null;

                                osMap[relay.os] = osMap[relay.os] >= 0 ? osMap[relay.os] + 1 : 1;
                                versions[relay.tor] = versions[relay.tor] >= 0 ? versions[relay.tor] + 1 : 1;
                            } catch (e) {
                                logger.info(relay.nickname, e.message);
                            }
                        }

                        relay.exit_policy_summary['_' + target] = [];
                        relay.exit_policy_summary['_' + target + '_range'] = [];

                        for (var portRangeIndex = 0; portRangeIndex < relay.exit_policy_summary[target].length; portRangeIndex++) {
                            var portRange = relay.exit_policy_summary[target][portRangeIndex],
                                range = portRange.split('-');

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
                        }
                    }

                    // result.bridges.forEach(function(bridge)
                    for (var bridgeIndex = 0; bridgeIndex < result.bridges.length; bridgeIndex++) {
                        var bridge = result.bridges[bridgeIndex];
                        if (bridge.platform) {
                            try {
                                var parsedBridgePlatform = parsePlatform(bridge.platform);
                                bridge.tor = parsedBridgePlatform.tor;
                                bridge.git = parsedBridgePlatform.git;
                                bridge.meta = parsedBridgePlatform.meta;
                                bridge.arch = parsedBridgePlatform.arch;
                                bridge.os = parsedBridgePlatform.os;
                                bridge.version = parsedBridgePlatform.version;
                                bridge.client = parsedBridgePlatform.client;
                                bridge.osString = parsedBridgePlatform.osString;

                                osMap[relay.os] = osMap[relay.os] >= 0 ? osMap[relay.os] + 1 : 1;
                                versions[relay.tor] = versions[relay.tor] >= 0 ? versions[relay.tor] + 1 : 1;
                            } catch (e) {
                                logger.warn(e.message);
                            }
                        }

                    }


                    var valNumMapFn = function (result, value, key) {
                            result.push({val: key, num: value});
                        },
                        mapFn = function (obj) {
                            return obj.val;
                        }, sortFn = function (a, b) {
                            return b.num - a.num;
                        };

                    globalData.search.os = _.transform(osMap, valNumMapFn, []).sort(sortFn).map(mapFn);
                    globalData.search.tor = _.transform(versions, valNumMapFn, []).sort(sortFn).map(mapFn);

                    logger.info('overwrote available os:', JSON.stringify(globalData.search.os));
                    logger.info('overwrote available tor versions:', JSON.stringify(globalData.search.tor));

                    if (result.relays.length) {
                        insertPromises.push(RSVP.denodeify(collections.relays.insert.bind(collections.relays))(result.relays, {}));
                    }
                    if (result.bridges.length) {
                        insertPromises.push(RSVP.denodeify(collections.bridges.insert.bind(collections.bridges))(result.bridges, {}));
                    }

                    RSVP.all(insertPromises).then(function () {
                        // unlock database after sync
                        unlock();

                        updateDurations.push(Date.now() - currentUpdateStarted);
                        if (updateDurations.length > 10) {
                            // remove oldest value from array if length > 10
                            updateDurations.splice(0, 1);
                        }
                        currentUpdateStarted = -1;
                        // log update durations
                        logger.info('Download finished. Took %s ms', updateDurations[updateDurations.length - 1]);

                        // resolve with database and created collection
                        resolve();

                    }, function (err) {
                        logger.info(err.message);
                        reject(err);
                    });
                }, function (err) {
                    logger.warn(err.message);
                    reject(err);
                });
            }, function (err) {
                logger.warn(err.message);
                reject(err);
            });

        }, function (err) {
            logger.error(err.message);
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
        waitForReload = !!opts.waitForReload,
        dbUrl = opts.dbUrl;

    assert(typeof dbUrl === 'string', 'Expected a database url.');

    return new RSVP.Promise(function (resolve, reject) {
        logger.info('connecting to mongodb');

        // connect to db
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                database = db;

                // create collections for relays and bridges
                RSVP.hash({
                    relays: RSVP.denodeify(database.createCollection.bind(database))('relays'),
                    bridges: RSVP.denodeify(database.createCollection.bind(database))('bridges')
                }).then(function (createdCollections) {

                    collections = createdCollections;

                    var resolveData = {
                        database: database,
                        isLocked: isLocked,
                        collections: createdCollections
                    };

                    if (!skipReloadData) {
                        // Lock the database and start the initial onionoo data loading.
                        // We don't wait for it to complete and resolve immediately.
                        lock();
                        if (waitForReload) {
                            reloadData().then(function () {
                                resolve(resolveData);
                            });
                        } else {
                            reloadData();
                        }
                    }
                    if (!waitForReload) {
                        resolve(resolveData);
                    }
                });
            }
        });
    });
}

/**
 * Function that creates an interval that reloads the database structure + onionoo dump
 * @return {void}
 */
function initSyncTask() {
    setTimeout(function syncTimeout() {
        reloadData().then(function () {
            initSyncTask();
        });
    }, conf.DB.SYNC_INTERVAL);
}

module.exports = {
    remainingUpdateDuration: remainingUpdateDuration,
    init: init,
    initSyncTask: initSyncTask,
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    reloadData: reloadData
};
