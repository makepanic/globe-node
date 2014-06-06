/* eslint no-console: 0 */

var program = require('commander'),
    pkg = require('./package.json'),
    conf = require('./config'),
    http = require('http'),
    path = require('path'),

    globals = require('./src/lib/globalData'),
    connection = require('./src/lib/db/connection'),
    format = require('./src/lib/util/formatter'),

// express
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    favicon = require('serve-favicon'),

// custom middleware
    featureFlags = require('./src/lib/middleware/featureFlags'),
    handle404 = require('./src/lib/middleware/handle404'),
    normalizeQuery = require('./src/lib/middleware/normalize-query'),
    renderIf = require('./src/lib/middleware/render-if'),

// routes
    routes = require('./src/routes'),
    detail = require('./src/routes/detail'),
    search = require('./src/routes/search'),
    top10 = require('./src/routes/top10'),
    searchCompass = require('./src/routes/searchCompass'),
    graphs = require('./src/routes/graphs');

// init cli option handling
program
    .version(pkg.version)
    .option('-d, --dev', 'uses development settings')
    .option('-n, --nosync', 'disable db automatically syncing')
    .option('-db, --dburl [dbUrl]', 'set the mongodb database url [' + conf.DB.URL + ']', conf.DB.URL)
    .option('-p, --port <portNum>', 'sets the port where the application server should listen for requests', '3000')
    .parse(process.argv);

var app = express();

// overwrite dburl if in env
if (process.env.DBURL) { program.dburl = process.env.DBURL; }
// overwrite port if in env
if (process.env.PORT) { program.port = process.env.PORT; }

// all environments
app.set('port', parseInt(program.port, 10));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'src/public/images/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(featureFlags(conf.FEATURES));

// development only
if (app.get('env') === 'development') {
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
globals.DEV = !!program.dev;

// make the globals object accessable for every template
app.locals = globals;

// init connection and start http server
connection.init({
    skipReload: program.nosync,
    dbUrl: program.dburl
}).then(function (connectionData) {
    console.log('connection ready');

    // routes that need db access

    app.get('/search-compass',
        renderIf(connectionData.isLocked, 'locked'),
        normalizeQuery({
            integer: ['limit'],
            checkbox: ['exit', 'groupAS', 'groupCountry', 'groupFamily', 'groupContact'],
            empty: ['exitSpeed', 'as', 'family', 'country', 'flag', 'type', 'query'],
            boolean: ['sortAsc', 'running']
        }),
        searchCompass.searchCompass(connectionData.collections));

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
