var program = require('commander'),
    connection = require('./lib/db/connection'),
    pkg = require('./package.json'),
    globals = require('./lib/globalData'),
    format = require('./lib/util/formatter'),
    http = require('http'),
    path = require('path'),

// express
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    favicon = require('static-favicon'),

// custom middleware
    featureFlags = require('./lib/middleware/featureFlags'),
    handle404 = require('./lib/middleware/handle404'),
    normalizeQuery = require('./lib/middleware/normalize-query'),

// routes
    routes = require('./routes'),
    detail = require('./routes/detail'),
    search = require('./routes/search'),
    top10 = require('./routes/top10'),
    compass = require('./routes/compass'),
    searchCompass = require('./routes/searchCompass'),
    graphs = require('./routes/graphs');

// init cli option handling
program
    .version(pkg.version)
    .option('-n, --nosync', 'disable db automatically syncing')
    .option('-db, --dburl [dbUrl]', 'set the database url [mongodb://localhost:27017/onionoo]', 'mongodb://localhost:27017/onionoo')
    .option('-p, --port <portNum>', 'set the port where the web server should listen for requests.', '3000')
    .parse(process.argv);

var app = express();

// overwrite dburl if env
if (process.env.DBURL) {
    program.dburl = process.env.DBURL;
}

console.log('connectiong via', program.dburl);

// all environments
app.set('port', parseInt(program.port, 10));
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

// some global variables for the search form
globals.advSearch = {
    actions: {},
    group: {},
    filter: {}
};
globals.version = pkg.version;
globals.format = format;

// make the globals object accessable for every template
app.locals = globals;

// init connection and start http server
connection.init({
    skipReload: program.nosync,
    dbUrl: program.dburl
}).then(function (resolveData) {
    console.log('connection ready');

    // routes that need db access
    app.get('/compass/filter', compass.filter(resolveData.collections));
    app.get('/compass/group', compass.group(resolveData.collections));

    app.get('/search-compass',
        normalizeQuery({
            integer: ['limit'],
            checkbox: ['exit', 'groupAS', 'groupCountry', 'groupFamily', 'groupContact'],
            empty: ['as', 'family', 'country', 'flag', 'type', 'query'],
            boolean: ['running']
        }),
        searchCompass.searchCompass(resolveData.collections));

    if (!program.nosync) {
        connection.initSyncTask();
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

// resource not found handling
    app.use(handle404());
}, function (err) {
    console.error(err);
});
