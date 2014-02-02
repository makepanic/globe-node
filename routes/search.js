var search = require('../lib/onionoo/search'),
    formatter = require('../lib/util/formatter'),
    constants = require('../lib/static');

module.exports = function(req, res){
    var cfg = req.query,
        data = {
            title: ['Results for "' + cfg.query + '"'],
            query: '',
            path: 'search'
        },
        filter = {
            limit: 50,
            type: cfg.type,
            running: cfg.running,
            country: cfg.country,
            as: cfg.as,
            flag: cfg.flag
        };

    data.query = cfg.query;
    data.filter = filter;

    search({
        query: cfg.query,
        filter: filter
    }).then(function(summaries){
        // check if result length is over limit
        if(summaries.relays.length + summaries.bridges.length >= constants.numbers.maxSearchResults){
            data.alert = {
                type: 'info',
                msg: constants.messages.specifyYourSearch
            };
        }

        // assign model values
        data.model = {
            relays: summaries.relays,
            bridges: summaries.bridges
        };

        // apply formats for each relay
        data.model.relays.forEach(function(relay){
            relay.formattedBandwidth = formatter.bandwidth(relay.advertised_bandwidth);
            relay.formattedCountryFlag = formatter.flaggify(relay.country);
            relay.formattedUptime = formatter.uptimeShort(relay.last_restarted);
            relay.formattedFlags = formatter.onionFlags(relay.flags);
            if (relay.or_addresses.length) {
                relay.formattedOrPort = formatter.port(relay.or_addresses[0]);
            }
            relay.formattedDirPort = formatter.port(relay.dir_address);
        });

        // apply formats for each bridge
        data.model.bridges.forEach(function(bridge){
            bridge.formattedBandwidth = formatter.bandwidth(bridge.advertised_bandwidth);
            bridge.formattedUptime = formatter.uptimeShort(bridge.last_restarted);
            bridge.formattedFlags = formatter.onionFlags(bridge.flags);
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