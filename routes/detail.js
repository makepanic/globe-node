var lookup = require('../lib/onionoo/lookup');

exports.bridge = function(req, res){
    res.render('bridge', {
        title: 'Express'
    });
};

exports.relay = function(store){
    return function(req, res){
        var fingerprint = req.params.fingerprint;
        lookup(fingerprint, false, store).then(function(detail){
            console.log('detail', detail);
            res.render('relay', {
                title: 'Express'
            });
        });
    };
};