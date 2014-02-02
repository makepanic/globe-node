var RSVP = require('rsvp'),
    _ = require('lodash'),
    request = require('request'),
    is40CharHex = require('../util/is40CharHex'),
    hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./normalize');

module.exports = function(options){
    var currentCfg,
        filter,
        defaultCfg = {
            filter: {},
            query: '',
            fields: ['fingerprint', 'nickname', 'advertised_bandwidth', 'last_restarted', 'country', 'flags', 'or_addresses', 'dir_address', 'running', 'hashed_fingerprint']
        },
        url = 'https://onionoo.torproject.org/details?';

    currentCfg = _.merge(defaultCfg, options);

    // build fields param
    url += '&fields=' + currentCfg.fields.join(',');

    if (currentCfg.query.length){
        // check if query is a 40 char hex and hash if it's true
        if(is40CharHex(currentCfg.query)){
            currentCfg.query = hashFingerprint(currentCfg.query);
        }

        url += '&search=' + currentCfg.query;
    }

    // apply filters to the url
    if (Object.keys(currentCfg.filter).length) {
        for (filter in currentCfg.filter) {
            // check if filter has property and filter value is not null
            if (currentCfg.filter.hasOwnProperty(filter) && currentCfg.filter[filter]) {
                var filterValue = currentCfg.filter[filter],
                    // check if value is string and length is 0 (+ cast to boolean)
                    isEmptyString = !!(_.isString(filterValue) && filterValue.length === 0);

                // is no empty string
                if (!isEmptyString) {
                    url += '&' + filter + '=' + currentCfg.filter[filter];
                }
            }
        }
    }

    console.log('requesting', url);

    // building the query
    return new RSVP.Promise(function(resolve, reject){
        request({
            url: url,
            timeout: 10000
        }, function(err, resp, body){
            var result;

            if (err) {
                console.log(err);
                reject(err);
            }

            try {
                // parse json from body
                result = JSON.parse(body);

                // resolve with normalized result
                resolve(normalize.details(result));
            } catch(e){
                //error parsing body
                reject(e);
            }
        });
    });
};