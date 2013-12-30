
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , detail = require('./routes/detail')
  , search = require('./routes/search')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , store = require('./lib/storage')
  , globals = require('./lib/globalData')
  , apiDetail = require('./onion-dump/details');

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

app.get('/', routes.index);
app.get('/help', routes.help);
app.get('/code', routes.code);
app.get('/users', user.list);

app.get('/relay/:fingerprint', detail.relay(store));
app.get('/search', search);
app.get('/bridge/:fingerprint', detail.bridge);

app.get('/api/:fingerprint', function(req, res){
    res.send(apiDetail);
});

app.locals(globals);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
