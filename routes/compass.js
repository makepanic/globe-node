var filter = require('../lib/db/onionoo-mongo/filter');

exports.filter = function(collections) {
    return function(req, res) {
        filter(collections, {
            inactive: false
        }).then(function(result){
            res.send({
                bridges: result.bridges.length,
                relays: result.relays.length
            })
        })
    }
};