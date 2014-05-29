var search = require('../lib/onionoo/api/search'),
    formatter = require('../lib/util/formatter'),
    constants = require('../lib/static');

module.exports = function(req, res){
    var data = {
        path: 'top10',
        title: ['Top 10 relays']
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
        var errMsg;

        if (err.hasOwnProperty('code')) {
            errMsg = constants.messages.hasOwnProperty(err.code) ? constants.messages[err.code] : err.code;
        } else {
            errMsg = constants.messages.invalidSearchTerm;
        }
        data.alert = {
            type: 'info',
            msg: errMsg
        };
        res.render('search', data);
    });

};