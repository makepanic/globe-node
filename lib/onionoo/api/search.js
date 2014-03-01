var config = require('../config'),
    RSVP = require('rsvp'),
    _ = require('lodash'),
    request = require('request'),
    is40CharHex = require('../util/is40CharHex'),
    hashFingerprint = require('../util/hashFingerprint'),
    normalize = require('./../util/normalize');

module.exports = function(options){
    var currentCfg,
        filter,
        was40CharHex = false,
        defaultCfg = {
            skipFingerprintCheck: false,
            filter: {},
            query: '',
            fields: ['fingerprint', 'nickname', 'advertised_bandwidth', 'last_restarted', 'country', 'flags', 'or_addresses', 'dir_address', 'running', 'hashed_fingerprint']
        },
        url = config.BASE_URL + 'details?';

    currentCfg = _.merge(defaultCfg, options);

    // build fields param
    url += '&fields=' + currentCfg.fields.join(',');

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

    // building the query
    return new RSVP.Promise(function(resolve, reject){
        if (currentCfg.query.length){
            // check if query is a 40 char hex and hash if it's true
            if(!currentCfg.skipFingerprintCheck && is40CharHex(currentCfg.query)){
                was40CharHex = true;
                try{
                    currentCfg.query = hashFingerprint(currentCfg.query);
                } catch (hashErr) {
                    reject(hashErr);
                }
            }
            url += '&search=' + currentCfg.query;
        }

        request({
            url: url,
            timeout: config.REQUEST_TIMEOUT
        }, function(err, resp, body){
            var result;

            if (err) {
                reject(err);
            }

            try {
                // parse json from body
                result = JSON.parse(body);

                // normalize results
                result = normalize.details(result);

                // store hashed fingerprint if query was 40char hex
                result.hashedFingerprint = was40CharHex ? currentCfg.query : undefined;

                // resolve with normalized result
                resolve(result);
            } catch(e){
                //error parsing body
                reject(e);
            }
        });
    });
};