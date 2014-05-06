var connection = require('./lib/db/connection'),
    pkg = require('./package.json'),
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    favicon = require('static-favicon'),
    featureFlags = require('./lib/middleware/featureFlags'),
    handle404 = require('./lib/middleware/handle404'),
    routes = require('./routes'),
    detail = require('./routes/detail'),
    search = require('./routes/search'),
    top10 = require('./routes/top10'),
    http = require('http'),
    path = require('path'),
    globals = require('./lib/globalData'),
    graphs = require('./routes/graphs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(featureFlags());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
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
app.get('/bridge/uptime/:fingerprint.svg', graphs.bridge.uptime);
app.get('/bridge/bandwidth/:fingerprint.svg', graphs.bridge.bandwidth);
app.get('/bridge/client/:fingerprint.svg', graphs.bridge.clients);

globals.version = pkg.version;
app.locals = globals;

// init connection and start http server
connection.init().then(function (err, data) {
    console.log('connection ready');
    if (err) {
        throw err;
    } else {
        connection.initSyncTask();
        http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});

// resource not found handling
app.use(handle404());