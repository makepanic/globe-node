var lookup = require('../lib/onionoo/lookup'),
    formatter = require('../lib/util/formatter');

exports.bridge = function(req, res){
    res.render('bridge', {
        title: 'Express'
    });
};

exports.relay = function(store){
    return function(req, res){
        var fingerprint = req.params.fingerprint;

        lookup(fingerprint, false, store).then(function(detail){
            var relay;

            // initialize data holder with global data
            var data = {
                title: 'Express',
                model: null
            };

            if (detail.relay){
                // has relay details
                relay = detail.relay;

                console.log('using relay', relay);

                // set view model
                data.model = relay;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.formattedCountryFlag = formatter.flaggify(data.model.country);

                if (data.model.family.length){
                    data.model.formattedFamily = data.model.family.map(function(val){
                        return formatter.familyToFingerprint(val);
                    });
                }
            }

            console.log('data', data);

            res.render('relay', data);
        });
    };
};