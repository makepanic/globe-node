var RSVP = require('rsvp'),
    _ = require('lodash'),
    request = require('request'),
    normalize = require('./normalize');

module.exports = function(options){
    var currentCfg,
        defaultCfg = {
            filter: [],
            query: '',
            fields: ['fingerprint', 'nickname', 'advertised_bandwidth', 'last_restarted', 'country', 'flags', 'or_addresses', 'dir_address', 'running', 'hashed_fingerprint']
        },
        url = 'https://onionoo.torproject.org/details?limit=50';

    currentCfg = _.merge(defaultCfg, options);

    console.log('')

    // build fields param
    url += '&fields=' + currentCfg.fields.join(',');

    if (currentCfg.query.length){
        url += '&search=' + currentCfg.query;
    }

    // TODO: filter params

    console.log('requesting', url);

    // building the query
    return new RSVP.Promise(function(resolve, reject){
        request({
            url: url,
            timeout: 3000
        }, function(err, resp, body){
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('body', body);

            // parse json from body
            var result = JSON.parse(body);

            // resolve with normalized result
            resolve(normalize.details(result));
        });
    });
};