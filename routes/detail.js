var errors = require('../lib/errors'),
    lookup = require('../lib/onionoo/lookup'),
    formatter = require('../lib/util/formatter');

exports.bridge = function(store){
    return function(req, res){
        var fingerprint = req.params.fingerprint;

        lookup(fingerprint, false, store).then(function(detail){
            var bridge,
                // initialize data holder with general data
                data = {
                    title: ['Bridge'],
                    path: 'bridge',
                    model: null
                };

            // check if result found (found = has hashed_fingerprint)
            if (detail.bridge && detail.bridge.hasOwnProperty('hashed_fingerprint')){
                // has relay details
                bridge = detail.bridge;

                // fill title
                data.title = ['Details for ' + bridge.nickname].concat(data.title);

                // set view model
                data.model = bridge;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.bandwidthGraphUrl = '/bridge/bandwidth/' + bridge.hashed_fingerprint + '.svg';
                res.render('bridge', data);
            } else {
                // no result found
                res.render('error', {
                    msg: errors.BridgeNotFound
                });
            }

        }, function(err){
            console.error(err);
            res.render('error', {
                msg: err
            });
        });
    };
};

exports.relay = function(store){
    return function(req, res){
        var fingerprint = req.params.fingerprint;

        lookup(fingerprint, false, store).then(function(detail){
            var relay,
            // initialize data holder with general data
                data = {
                    title: ['Relay'],
                    path: 'relay',
                    model: null
                };

            // check if result found (found = has fingerprint)
            if (detail.relay && detail.relay.hasOwnProperty('fingerprint')){
                // has relay details
                relay = detail.relay;

                // fill title
                data.title = ['Details for ' + relay.nickname].concat(data.title);

                // set view model
                data.model = relay;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.formattedCountryFlag = formatter.flaggify(data.model.country);
                data.model.bandwidthGraphUrl = '/relay/bandwidth/' + relay.fingerprint + '.svg';
                data.model.historyGraphUrl = '/relay/history/' + relay.fingerprint + '.svg';

                if (data.model.family.length){
                    data.model.formattedFamily = data.model.family.map(function(val){
                        return formatter.familyToFingerprint(val);
                    });
                }

                res.render('relay', data);
            } else {
                // no result found
                res.render('error', {
                    msg: errors.RelayNotFound
                });
            }

        }, function(err){
            console.error(err);
            res.render('error', {
                msg: err
            });
        });
    };
};