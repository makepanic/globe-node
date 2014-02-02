var bandwidth = require('../lib/onionoo/bandwidth'),
    weights = require('../lib/onionoo/weights'),
    historyGraph = require('../lib/graphs/historyGraph'),

    hasRenderRequirements = function(data, type) {
        return data.hasOwnProperty(type) && data[type].periods.length;
    };

exports.relay = {
    bandwidth: function(req, res) {
        var fingerprint = req.params.fingerprint;

        bandwidth(fingerprint).then(function(bandwidthData){

            if (hasRenderRequirements(bandwidthData, 'relays')) {

                var svgGraph = historyGraph.svg({
                    period: bandwidthData.relays.periods[0],
                    data: bandwidthData.relays.history,
                    graphs: ['readHistory', 'writeHistory'],
                    labels: ['written bytes per second', 'read bytes per second'],
                    tickFormat: 's',
                    legendPos: [{x:60,y:25}, {x:270,y:25}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);

            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            console.error(err);
            res.render('error', {
                msg: err
            });
        });
    },
    history: function(req, res) {
        var fingerprint = req.params.fingerprint;

        weights(fingerprint).then(function(historyData){

            if (hasRenderRequirements(historyData, 'relays')) {

                var svgGraph = historyGraph.svg({
                    data: historyData.data,
                    period: historyData.periods[0],
                    graphs: ['advertisedBandwidth', 'consensusWeightFraction', 'guardProbability', 'exitProbability'],
                    labels: ['advertised bandwidth fraction', 'consensus weight fraction','guard probability', 'exit probability'],
                    tickFormat: 's',
                    legendPos: [{x:80,y:35},{x:80,y:15},{x:270,y:15}, {x:270,y:35}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);
            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            console.error(err);
            res.render('error', {
                msg: err
            });
        });
    }
};

exports.bridge = {
    bandwidth: function(req, res) {
        var fingerprint = req.params.fingerprint;

        bandwidth(fingerprint).then(function(bandwidthData){

            if (hasRenderRequirements(bandwidthData, 'bridges')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: 1100, h: 300 },
                    period: bandwidthData.bridges.periods[0],
                    data: bandwidthData.bridges.history,
                    graphs: ['readHistory', 'writeHistory'],
                    labels: ['written bytes per second', 'read bytes per second'],
                    tickFormat: 's',
                    legendPos: [{x:60,y:25}, {x:270,y:25}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);
            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            console.error(err);
            res.render('error', {
                msg: err
            });
        });
    }
};