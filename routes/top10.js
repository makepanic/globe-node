var search = require('../lib/onionoo/search'),
    formatter = require('../lib/util/formatter'),
    constants = require('../lib/static');

module.exports = function(req, res){
    var data = {
        title: 'Express'
    };

    search({
        filter: {
            limit: 10,
            order: '-consensus_weight'
        }
    }).then(function(summaries){
        data.model = {
            relays: summaries.relays
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

        res.render('top10', data);
    }, function(err){
        //TODO: error handling
        data.alert = {
            type: 'info',
            msg: constants.messages.invalidSearchTerm
        };
        res.render('search', data);
    });

};