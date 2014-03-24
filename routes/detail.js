var errors = require('../lib/errors'),
    RSVP = require('rsvp'),
    lookup = require('../lib/onionoo/api/lookup'),
    bandwidth = require('../lib/onionoo/api/bandwidth'),
    weights = require('../lib/onionoo/api/weights'),
    formatter = require('../lib/util/formatter');

exports.bridge = function(req, res){
    var fingerprint = req.params.fingerprint;

    lookup(fingerprint, false).then(function(detail){
        var bridge,
            // initialize data holder with general data
            data = {
                title: ['Bridge'],
                path: 'bridge',
                model: null
            };

        // check if result found (found = has hashed_fingerprint)
        if (detail.bridge && detail.bridge.hasOwnProperty('hashed_fingerprint')){

            bandwidth(fingerprint).then(function(bandwidthData){

                // has relay details
                bridge = detail.bridge;

                // fill title
                data.title = ['Details for ' + bridge.nickname].concat(data.title);

                // set view model
                data.model = bridge;

                // set graph periods
                data.model.bandwidthPeriods = bandwidthData.bridges.periods;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedOrAddresses = data.model.or_addresses.map(function(address){
                    return formatter.anonymizeIpAddress(address);
                });
                data.model.formattedUptimeSeen = formatter.uptimeFull(data.model.last_seen);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.bandwidthGraphUrl = '/bridge/bandwidth/' + bridge.hashed_fingerprint + '.svg';
                res.render('bridge', data);

            });
        } else {
            // no result found
            res.render('error', {
                msg: errors.BridgeNotFound
            });
        }

    }, function(err){
        res.render('error', {
            msg: err
        });
    });
};

exports.relay = function(req, res){
    var fingerprint = req.params.fingerprint;

    lookup(fingerprint, false).then(function(detail){
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

            RSVP.hash({
                bandwidth: bandwidth(fingerprint),
                weights: weights(fingerprint)
            }).then(function(results){
                // fill title
                data.title = ['Details for ' + relay.nickname].concat(data.title);

                // set view model
                data.model = relay;

                // apply formatter
                data.model.formattedUptimeRestarted = formatter.uptimeFull(data.model.last_restarted);
                data.model.formattedUptimeSeen = formatter.uptimeFull(data.model.last_seen);
                data.model.formattedAdvertisedBandwith = formatter.bandwidth(data.model.advertised_bandwidth);
                data.model.formattedCountryFlag = formatter.flaggify(data.model.country);
                data.model.bandwidthGraphUrl = '/relay/bandwidth/' + relay.fingerprint + '.svg';
                data.model.historyGraphUrl = '/relay/history/' + relay.fingerprint + '.svg';

                // set graph periods
                data.model.bandwidthPeriods = results.bandwidth.relays.periods;
                data.model.weightPeriods = results.weights.periods;

                if (data.model.family.length){
                    data.model.formattedFamily = data.model.family.map(function(val){
                        return formatter.familyToFingerprint(val);
                    });
                }

                res.render('relay', data);
            });

        } else {
            // no result found
            res.render('error', {
                msg: errors.RelayNotFound
            });
        }

    }, function(err){
        res.render('error', {
            msg: err
        });
    });
};