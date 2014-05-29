var search = require('../lib/onionoo/api/search'),
    formatter = require('../lib/util/formatter'),
    constants = require('../lib/static');

function buildSearchResult (data, summaries, hashedFingerprint) {
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

    // check if user searched for a bridge using an unhashed fingerprint
    if (hashedFingerprint && summaries.bridges.length === 1 && summaries.relays.length === 0 &&
        summaries.bridges[0].hashed_fingerprint === hashedFingerprint
        ) {
        // search was 40char hex and hashed fingerprint is same as result bridge hashed fingerprint
        data.model.hashFingerprintWarning = true;
        data.model.correctSearchUrl = '/search?query=' + hashedFingerprint;
    }

    // apply formats for each relay
    data.model.relays.forEach(function(relay){
        relay.formattedBandwidth = formatter.bandwidth(relay.advertised_bandwidth);
        relay.formattedCountryFlag = formatter.flaggify(relay.country);
        relay.formattedUptime = formatter.uptimeShort(relay.last_restarted);
        relay.formattedFlags = formatter.onionFlags(relay.flags);
    });

    // apply formats for each bridge
    data.model.bridges.forEach(function(bridge){
        bridge.formattedBandwidth = formatter.bandwidth(bridge.advertised_bandwidth);
        bridge.formattedUptime = formatter.uptimeShort(bridge.last_restarted);
        bridge.formattedFlags = formatter.onionFlags(bridge.flags);
    });

    return data;
}

exports.searchNotAlreadyHashed = function(req, res){
    /*eslint handle-callback-err:0*/
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
    // write on data.filter because filter is used for searching in
    data.group = {
        country: cfg.groupCountry ? cfg.groupCountry === 'on' : false,
        family: cfg.groupFamily ? cfg.groupFamily === 'on' : false,
        contact: cfg.groupContact ? cfg.groupContact === 'on' : false
    };

    search({
        query: cfg.query,
        filter: filter
    }).then(function(summaries){
        res.render('search', buildSearchResult(data, summaries, summaries.hashedFingerprint));
    }, function(){
        data.alert = {
            type: 'info',
            msg: constants.messages.invalidSearchTerm
        };
        res.render('search', data);
    });
};

exports.searchAlreadyHashed = function(req, res){
    /*eslint handle-callback-err:0*/
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
    // write on data.filter because filter is used for searching in
    data.group = {
        country: cfg.groupCountry ? cfg.groupCountry === 'on' : false,
        family: cfg.groupFamily ? cfg.groupFamily === 'on' : false,
        contact: cfg.groupContact ? cfg.groupContact === 'on' : false
    };

    search({
        query: cfg.query,
        filter: filter,
        skipFingerprintCheck: true
    }).then(function(summaries){
        res.render('search', buildSearchResult(data, summaries, cfg.query));
    }, function(){
        data.alert = {
            type: 'info',
            msg: constants.messages.invalidSearchTerm
        };
        res.render('search', data);
    });

};