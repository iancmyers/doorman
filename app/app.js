    // Core modules
var http = require('http'),
    path = require('path'),
    // Configuration
    yaml = require('js-yaml'),
    config = require('./config.yml'),
    // Route handlers
    index = require('./index'),
    call = require('./call'),
    selection = require('./selection'),
    // Express
    express = require('express'),
    app = express();

if (app.get('env') != 'test') {
  app.use(express.logger('dev'));
}

app.set('port', process.env.PORT || 8000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());

// Inject the config into the request.
app.use(function (req, res, next) {
  req.config = config;
  next();
});

app.use(app.router);

app.get('/', index)
app.get('/call', call);
app.post('/call', selection);

// We export 'loadConfig' and 'server' for ease of tesing.
exports.loadConfig = function (path) {
  config = require(path);
};

exports.server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

