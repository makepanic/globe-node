var config = require('../config'),
    request = require('request'),
    RSVP = require('rsvp');

module.exports = function(path) {
    return new RSVP.Promise(function(resolve, reject){
        request({
            url: config.BASE_URL + path,
            timeout: config.REQUEST_TIMEOUT
        }, function(err, resp, body){
            var parsedBody;

            if (err) {
                reject(err);
            } else {
                if (resp.statusCode === 500) {
                    reject('Request returned: 500 Internal Server Error');
                }
                try{
                    parsedBody = JSON.parse(body);
                } catch (e) {
                    reject(e);
                }
                resolve(parsedBody);
            }
        });
    });
};