/* eslint no-console:0 */

var conf = require('../../config'),
    connection = require('../lib/db/connection'),
    logger = require('../../logger'),
    search = require('../lib/onionoo/api/search'),
    formatter = require('../lib/util/formatter'),
    filter = require('../lib/db/onionoo-mongo/filter'),
    group = require('../lib/db/onionoo-mongo/group');

var isGroupRequest = function (groupObj) {
    var isGroupRequest = false;
    // loop through all fields and stop if true value is found
    Object.keys(groupObj).forEach(function (key) {
        if (groupObj[key]) {
            isGroupRequest = true;
            return false;
        }
        return true;
    });
    return isGroupRequest;
};

exports.searchCompass = function (req, res) {
    /*eslint handle-callback-err:0*/
    var collections = connection.getCollections(),
        cfg = req.normQuery,
        data = {
            title: ['Search results'],
            query: '',
            path: 'search'
        },
        requestFilter;

    // remove $ prefix on family if exists
    if (cfg.family && typeof cfg.family === 'string' && cfg.family[0] === '$' && cfg.family.length > 1) {
        cfg.family = cfg.family.substring(1);
    }
    // add 'AS' to as filter
    if (cfg.as && cfg.as.substring(0, 2) !== 'AS') {
        cfg.as = 'AS' + cfg.as.substring(2);
    }

    requestFilter = {
        country: cfg.country,
        as: cfg.as ? cfg.as : null,
        exitSpeed: cfg.exitSpeed,
        running: cfg.running,
        guards: null,
        exit: cfg.exit,
        family: cfg.family,
        speed: null,
        flag: cfg.flag,
        os: cfg.os,
        tor: cfg.tor,
        query: cfg.query,
        type: cfg.type ? cfg.type : null
    };

    data.query = cfg.query;
    data.requestQuery = req.query;
    data.normRequestQuery = req.normQuery;

    data.advSearch = {
        filter: requestFilter,
        group: {
            country: cfg.groupCountry,
            family: cfg.groupFamily,
            contact: cfg.groupContact,
            as: cfg.groupAS
        },
        actions: {
            limit: cfg.limit
        }
    };

    if (!isGroupRequest(data.advSearch.group)) {
        // no grouping, use simple results
        filter(collections, {
            sortBy: cfg.sortBy,
            sortAsc: cfg.sortAsc,
            displayAmount: cfg.limit,
            filter: requestFilter,
            wasHashed: cfg.wasHashed
        }).then(function (result) {
            data.result = result;
            res.render('search-results/no-group', data);
        }, function (e) {
            if (e.dbLocked) {
                res.render('locked');
            } else {
                res.send(e);
            }
        });
    } else {
        // grouping, use grouped results
        group(collections, {
            sortBy: cfg.sortBy,
            sortAsc: cfg.sortAsc,
            displayAmount: cfg.limit,
            filter: requestFilter,
            group: data.advSearch.group
        }).then(function (result) {
            data.result = result;
            res.render('search-results/group', data);
        }, function (e) {
            // grouping
            logger.error(e);
            res.send({});
        });
    }
};
