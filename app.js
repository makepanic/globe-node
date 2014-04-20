
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , detail = require('./routes/detail')
  , search = require('./routes/search')
  , top10 = require('./routes/top10')
  , http = require('http')
  , path = require('path')
  , globals = require('./lib/globalData')
  , graphs = require('./routes/graphs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// static urls
app.get('/', routes.index);
app.get('/help', routes.help);
app.get('/code', routes.code);
app.get('/search', search.searchNotAlreadyHashed);
app.get('/search2', search.searchAlreadyHashed);
app.get('/top10', top10);

// dynamic urls
app.get('/relay/:fingerprint', detail.relay);
app.get('/bridge/:fingerprint', detail.bridge);

// graphs
app.get('/relay/bandwidth/:fingerprint.svg', graphs.relay.bandwidth);
app.get('/relay/weight/:fingerprint.svg', graphs.relay.weight);
app.get('/relay/uptime/:fingerprint.svg', graphs.relay.uptime);
app.get('/bridge/bandwidth/:fingerprint.svg', graphs.bridge.bandwidth);

globals.version = '0.0.1';
app.locals(globals);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// resource not found handling
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('error', {
            title: 404
        });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
