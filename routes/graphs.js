var bandwidth = require('../lib/onionoo/api/bandwidth'),
    uptime = require('../lib/onionoo/api/uptime'),
    clients = require('../lib/onionoo/api/clients'),
    weights = require('../lib/onionoo/api/weights'),
    historyGraph = require('../lib/graphs/historyGraph');

var hasRenderRequirements = function(data, type) {
        var hasRequirements = false;
        if (type) {
            // case bandwidth
            hasRequirements = data.hasOwnProperty(type) && data[type].periods.length;
        } else {
            // case history
            hasRequirements = data.periods.length;
        }
        return hasRequirements;
    };

exports.relay = {
    uptime: function(req, res){
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        uptime(fingerprint).then(function(uptimeData){
            if (hasRenderRequirements(uptimeData, 'relays')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: 550, h: 300 },
                    period: period || uptimeData.relays.periods[0],
                    data: uptimeData.relays.uptime,
                    graphs: ['uptime'],
                    labels: ['uptime'],
                    tickFormat: 's',
                    legendPos: [{x:60,y:30}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);

            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            res.render('error', {
                msg: err
            });
        });
    },
    bandwidth: function(req, res) {
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        bandwidth(fingerprint).then(function(bandwidthData){

            if (hasRenderRequirements(bandwidthData, 'relays')) {

                var svgGraph = historyGraph.svg({
                    dimension: { w: 550, h: 300 },
                    period: period || bandwidthData.relays.periods[0],
                    data: bandwidthData.relays.history,
                    graphs: ['readHistory', 'writeHistory'],
                    labels: ['written bytes per second', 'read bytes per second'],
                    tickFormat: 's',
                    legendPos: [{x:60,y:30}, {x:270,y:30}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);

            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            res.render('error', {
                msg: err
            });
        });
    },
    history: function(req, res) {
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        weights(fingerprint).then(function(historyData){

            if (hasRenderRequirements(historyData)) {

                var svgGraph = historyGraph.svg({
                    dimension: { w: 550, h: 300 },
                    data: historyData.data,
                    period: period || historyData.periods[0],
                    graphs: ['advertisedBandwidth', 'consensusWeightFraction', 'guardProbability', 'exitProbability'],
                    labels: ['advertised bandwidth fraction', 'consensus weight fraction','guard probability', 'exit probability'],
                    tickFormat: 's',
                    legendPos: [{x:80,y:45},{x:80,y:30},{x:270,y:30}, {x:270,y:45}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);
            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            res.render('error', {
                msg: err
            });
        });
    }
};

exports.bridge = {
    bandwidth: function(req, res) {
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        bandwidth(fingerprint).then(function(bandwidthData){

            if (hasRenderRequirements(bandwidthData, 'bridges')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: 1100, h: 300 },
                    period: period || bandwidthData.bridges.periods[0],
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
            res.render('error', {
                msg: err
            });
        });
    },
    clients: function(req, res) {
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        clients(fingerprint).then(function(bandwidthData){

            if (hasRenderRequirements(bandwidthData, 'bridges')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: 1100, h: 300 },
                    period: period || bandwidthData.bridges.periods[0],
                    data: bandwidthData.bridges.clients,
                    graphs: ['averageClients'],
                    labels: ['concurrent users'],
                    tickFormat: 's',
                    legendPos: [{x:60,y:25}]
                });

                res.set('Content-Type', 'image/svg+xml');
                res.send(svgGraph);
            } else {
                res.status(404).render('error', {
                    title: 404
                });
            }

        }, function(err){
            res.render('error', {
                msg: err
            });
        });
    }
};