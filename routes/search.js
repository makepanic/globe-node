var search = require('../lib/onionoo/search'),
    constants = require('../lib/static');

module.exports = function(req, res){
    var cfg = req.query,
        data = {
            title: 'Express',
            query: ''
        };

    search(cfg.query, {
    }).then(function(summaries){
        console.log('req.query', cfg);

        data.query = cfg.query;

        // success
        if(summaries.relays.length >= constants.numbers.maxSearchResults ||
            summaries.bridges.length >= constants.numbers.maxSearchResults){
            data.alert = {
                type: 'info',
                msg: constants.messages.specifyYourSearch
            };
        }

        data.model = {
            relays: summaries.relays,
            bridges: summaries.bridges
        };

        res.render('search', data);
    }, function(err){

        data.alert = {
            type: 'info',
            msg: constants.messages.invalidSearchTerm
        };

        res.render('search', data);
    });

};