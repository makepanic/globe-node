/* eslint no-console:0 */

var search = require('../lib/onionoo/api/search'),
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

exports.searchCompass = function (collections) {
    return function (req, res) {
        /*eslint handle-callback-err:0*/

        var cfg = req.query,
            data = {
                title: ['Results for "' + cfg.query + '"'],
                query: '',
                path: 'search'
            },
            requestFilter = {};

        console.log('using cfg', cfg);

        // remove $ prefix on family if exists
        if (cfg.family && typeof cfg.family === 'string' && cfg.family[0] === '$' && cfg.family.length > 1) {
            cfg.family = cfg.family.substring(1);
        }

        requestFilter = {
            country: cfg.country,
            as: cfg.as ? cfg.as : null,
            exitSpeed: cfg.exitSpeed,
            inactive: cfg.running,
            running: cfg.running,
            guards: null,
            exit: cfg.exit,
            family: cfg.family,
            speed: null,
            flag: cfg.flag
        };

        data.query = cfg.query;

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
                displayAmount: cfg.limit,
                filter: requestFilter
            }).then(function (result) {
                data.result = result;
                res.render('search-results/no-group', data);
            }, function (e) {
                res.send(e);
            });
        } else {
            // grouping, use grouped results
            group(collections, {
                displayAmount: cfg.limit,
                filter: requestFilter,
                group: data.advSearch.group
            }).then(function (result) {
                data.result = result;
                res.render('search-results/group', data);
            }, function (e) {
                // grouping
                console.error(e);
                res.send({});
            });
        }
    };
};