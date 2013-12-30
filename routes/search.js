var search = require('../lib/onionoo/search'),
    formatter = require('../lib/util/formatter'),
    constants = require('../lib/static');

module.exports = function(req, res){
    var cfg = req.query,
        data = {
            title: 'Express',
            query: ''
        };

    search({
        query: cfg.query
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

        data.model.relays.forEach(function(relay){
            // formatter
            relay.formattedBandwidth = formatter.bandwidth(relay.advertised_bandwidth);
            relay.formattedCountryFlag = formatter.flaggify(relay.country);
            relay.formattedUptime = formatter.uptimeShort(relay.last_restarted);
            relay.formattedFlags = formatter.onionFlags(relay.flags);
            if (relay.or_addresses.length) {
                relay.formattedOrPort = formatter.port(relay.or_addresses[0]);
            }
            relay.formattedDirPort = formatter.port(relay.dir_address);
        });

        res.render('search', data);

    }, function(err){
        data.alert = {
            type: 'info',
            msg: constants.messages.invalidSearchTerm
        };
        res.render('search', data);
    });

};