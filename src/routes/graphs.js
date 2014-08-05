var bandwidth = require('../lib/onionoo/api/bandwidth'),
    uptime = require('../lib/onionoo/api/uptime'),
    clients = require('../lib/onionoo/api/clients'),
    weights = require('../lib/onionoo/api/weights'),
    historyGraph = require('../lib/graphs/history-graph');

var GRAPH_HEIGHT = 200,
    GRAPH_WIDTH = 550;

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
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
                    period: period || uptimeData.relays.periods[0],
                    data: uptimeData.relays.history,
                    graphs: ['uptime'],
                    labels: ['uptime'],
                    tickFormat: '%',
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
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
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
    weight: function(req, res) {
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        weights(fingerprint).then(function(historyData){

            if (hasRenderRequirements(historyData, 'relays')) {

                var svgGraph = historyGraph.svg({
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
                    period: period || historyData.relays.periods[0],
                    data: historyData.relays.history,
                    graphs: ['advertisedBandwidth', 'consensusWeightFraction', 'guardProbability', 'exitProbability'],
                    labels: ['advertised bandwidth fraction', 'consensus weight fraction','guard probability', 'exit probability'],
                    tickFormat: '.2%',
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
    uptime: function(req, res){
        var fingerprint = req.params.fingerprint,
            period = req.query.period;

        uptime(fingerprint).then(function(uptimeData){
            if (hasRenderRequirements(uptimeData, 'bridges')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
                    period: period || uptimeData.bridges.periods[0],
                    data: uptimeData.bridges.history,
                    graphs: ['uptime'],
                    labels: ['uptime'],
                    tickFormat: '%',
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

            if (hasRenderRequirements(bandwidthData, 'bridges')) {
                var svgGraph = historyGraph.svg({
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
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
                    dimension: { w: GRAPH_WIDTH, h: GRAPH_HEIGHT },
                    period: period || bandwidthData.bridges.periods[0],
                    data: bandwidthData.bridges.history,
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
