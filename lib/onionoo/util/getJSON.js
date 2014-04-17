var config = require('../config'),
    request = require('request'),
    RSVP = require('rsvp');

module.exports = function(path) {
    return new RSVP.Promise(function(resolve, reject){
        var url = config.BASE_URL + path;
        request({
            url: url,
            timeout: config.REQUEST_TIMEOUT
        }, function(err, resp, body){
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};