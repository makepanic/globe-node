var lookup = require('../lib/onionoo/lookup'),
    formatter = require('../lib/util/formatter');

exports.bridge = function(store){
    return function(req, res){
        var fingerprint = req.params.fingerprint;

        lookup(fingerprint, false, store).then(function(detail){
            var bridge,
                // initialize data holder with general data
                data = {
                    title: 'Express',
                    model: null
                };

            if (detail.relay){
                // has relay details
                bridge = detail.bridge;

                // set view model
                data.model = bridge;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
            }

            res.render('bridge', data);
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
                    title: 'Express',
                    model: null
                };

            if (detail.relay){
                // has relay details
                relay = detail.relay;

                // set view model
                data.model = relay;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.formattedCountryFlag = formatter.flaggify(data.model.country);
                data.model.bandwidthGraphUrl = '/relay/bandwidth/' + detail.relay.fingerprint + '.svg';
                data.model.historyGraphUrl = '/relay/history/' + detail.relay.fingerprint + '.svg';

                if (data.model.family.length){
                    data.model.formattedFamily = data.model.family.map(function(val){
                        return formatter.familyToFingerprint(val);
                    });
                }
            }

            res.render('relay', data);
        });
    };
};