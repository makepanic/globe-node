var config = require('../../../../config').ONIONOO,
    userAgent = require('../../global-data').userAgent,
    request = require('request'),
    RSVP = require('rsvp');

module.exports = function(path) {
    return new RSVP.Promise(function(resolve, reject){
        request.get(config.BASE_URL + path, {
            headers: {
                'User-Agent': userAgent
            },
            json: true,
            timeout: config.REQUEST_TIMEOUT
        }, function(err, resp, body){
            if (err) {
                reject(err);
            } else {
                if (resp.statusCode === 500) {
                    reject('Request returned: 500 Internal Server Error');
                }
                resolve(body);
            }
        });
    });
};
