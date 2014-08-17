/* eslint no-console: 0 */

// for performance profiling
//require('look').start();

var program = require('commander'),
    pkg = require('./package.json'),
    conf = require('./config'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    logger = require('./logger'),

    globals = require('./src/lib/global-data'),
    connection = require('./src/lib/db/connection'),
    format = require('./src/lib/util/formatter'),

// express
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    favicon = require('serve-favicon'),

// custom middleware
    errorHandler = require('./src/lib/middleware/error-handler'),
    featureFlags = require('./src/lib/middleware/feature-flags'),
    handle404 = require('./src/lib/middleware/handle404'),
    normalizeQuery = require('./src/lib/middleware/normalize-query'),
    renderIf = require('./src/lib/middleware/render-if'),

// routes
    routes = require('./src/routes'),
    detail = require('./src/routes/detail'),
    search = require('./src/routes/search'),
    top10 = require('./src/routes/top10'),
    searchCompass = require('./src/routes/search-compass'),
    graphs = require('./src/routes/graphs');

/* eslint no-sync: 0 */
if (!fs.existsSync('build')) {
    logger.error('Build dir not found. This happens if you haven\'t build the application assets. Run `gulp`.');
} else {

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
    if (process.env.DBURL) {
        program.dburl = process.env.DBURL;
    }
// overwrite port if in env
    if (process.env.PORT) {
        program.port = process.env.PORT;
    }

// all environments
    app.set('port', parseInt(program.port, 10));
    app.set('env', 'production');
    app.set('views', path.join(__dirname, 'src/views'));
    app.set('view engine', 'jade');
    app.use(favicon(path.join(__dirname, 'src/public/images/favicon.ico')));
    app.use(morgan());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'build')));
    app.use(featureFlags(conf.FEATURES));

// development only
// static urls
    app.get('/', routes.index);
    app.get('/help', routes.help);
    app.get('/code', routes.code);
    app.get('/search', search.searchNotAlreadyHashed);
    app.get('/search2', search.searchAlreadyHashed);
    app.get('/top10', top10);

// dynamic urls

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
    globals.userAgent = pkg.name + '/' + pkg.version + ' (+' + pkg.bugs.url + ')';
    globals.DEV = !!program.dev;

// make the globals object accessible for every template
    app.locals = globals;

// init connection and start http server
    connection.init({
        skipReload: program.nosync,
        dbUrl: program.dburl
    }).then(function (connectionData) {
        logger.info('connection ready');

        // routes that need db access
        // relay lookup
        app.get('/relay/:fingerprint', detail.relay);
        // bridge lookup
        app.get('/bridge/:fingerprint', detail.bridge);

        // relay and bridge search
        app.get('/search-compass',
            renderIf(connectionData.isLocked, 'locked', function () {
                return {remaining: connection.remainingUpdateDuration()};
            }),
            // normalize specific query params
            normalizeQuery({
                integer: ['limit'],
                checkbox: ['exit', 'groupAS', 'groupCountry', 'groupFamily', 'groupContact'],
                empty: ['exitSpeed', 'as', 'family', 'country', 'flag', 'type', 'query'],
                boolean: ['sortAsc', 'running'],
                array: [
                    {param: 'os', defaultsTo: globals.search.os},
                    {param: 'tor', defaultsTo: globals.search.tor}
                ]
            }),
            searchCompass.searchCompass);

        if (!program.nosync) {
            connection.initSyncTask();
        }

        http.createServer(app).listen(app.get('port'), function () {
            logger.info('Express server listening on port ' + app.get('port'));
        });

// resource not found handling
        app.use(handle404());
        app.use(errorHandler(logger, 'error'));
    }, function (err) {
        logger.error(err);
    });
}
