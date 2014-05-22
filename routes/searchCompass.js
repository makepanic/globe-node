var search = require('../lib/onionoo/api/search'),
    formatter = require('../lib/util/formatter'),
    filter = require('../lib/db/onionoo-mongo/filter');

exports.searchCompass = function (collections) {
    return function (req, res) {
        /*eslint handle-callback-err:0*/

        console.log('got', req.query);

        var cfg = req.query,
            config = {},
            data = {
                title: ['Results for "' + cfg.query + '"'],
                query: '',
                path: 'search'
            },
            requestFilter = {};

        console.log('using filter', requestFilter);

        requestFilter = {
            country: cfg.country,
            as: cfg.as ? cfg.as : null,
            exitSpeed: null,
            inactive: cfg.running,
            guards: null,
            exit: cfg.onlyExits,
            family: cfg.family,
            speed: null
        };

        data.query = cfg.query;
        data.filter = requestFilter;
        // write on data.filter because filter is used for searching in
        data.group = {
            country: cfg.groupCountry,
            family: cfg.groupFamily,
            contact: cfg.groupContact
        };

        if (!data.group.country && !data.group.family && !data.group.contact) {

            // no grouping, use simple results
            filter(collections, {
                filter: requestFilter
            }).then(function (result) {
                data.result = result;
                res.render('search-results/no-group', data);
            }, function (e) {
                res.send(e);
            });
        } else {
            // grouping
            res.send({});
        }
    };
};