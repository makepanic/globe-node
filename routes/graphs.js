var bandwidth = require('../lib/onionoo/bandwidth'),
    weights = require('../lib/onionoo/weights'),
    historyGraph = require('../lib/graphs/historyGraph');

exports.relay = {
    bandwidth: function(req, res) {
        var fingerprint = req.params.fingerprint;

        bandwidth(fingerprint).then(function(bandwidthData){

            var svgGraph = historyGraph.svg({
                period: bandwidthData.relays.periods[0],
                data: bandwidthData.relays,
                graphs: ['readHistory', 'writeHistory'],
                labels: ['written bytes per second', 'read bytes per second'],
                tickFormat: 's',
                legendPos: [{x:60,y:25}, {x:270,y:25}]
            });

            res.set('Content-Type', 'image/svg+xml');
            res.send(svgGraph);

        });
    },
    history: function(req, res) {
        var fingerprint = req.params.fingerprint;

        weights(fingerprint).then(function(historyData){

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

        });
    }
};