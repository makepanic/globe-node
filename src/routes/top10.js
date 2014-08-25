var search = require('../lib/onionoo/api/search'),
    formatter = require('../lib/util/formatter'),
    RSVP = require('rsvp'),
    normalize = require('../lib/onionoo/util/normalize'),
    connection = require('../lib/db/connection'),
    constants = require('../lib/static');

module.exports = function (req, res) {
    var data = {
            path: 'top10',
            title: ['Top 10 relays']
        },
        lookupFunction;

    if (connection.isLocked()) {
        // use onionoo
        lookupFunction = search({filter: {
            limit: 10,
            order: '-consensus_weight'
        }});
    } else {
        // use database lookup
        /* eslint camelcase: 0 */
        var collections = connection.getCollections(),
            lookupCursor = collections.relays
                .find()
                .sort({consensus_weight: -1})
                .limit(10);
        lookupFunction = RSVP.hash({
            relays: RSVP.denodeify(lookupCursor.toArray.bind(lookupCursor))(),
            bridges: []
        });
    }

    lookupFunction.then(function (summaries) {
        summaries = normalize.details(summaries);
        data.model = {
            relays: summaries.relays
        };

        data.model.relays.forEach(function (relay) {
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
    }, function (err) {
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
