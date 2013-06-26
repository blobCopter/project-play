
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator');

var app = express();

app.locals(require('./locals'));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.use(expressValidator());

app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playproject');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	app.get('/', home.index);
	app.get('/users', user.list);
	app.get('/register', require('./routes/register'));	
	app.post('/logout', require('./routes/logout'));
	app.get('/logout', require('./routes/logout'));
	app.post('/login', require('./routes/login'));
	app.get('/lookaround', require('./routes/lookaround').geo_page);
	app.post('/lookaround', require('./routes/lookaround').geo_service);
	app.use('/rest',  require('./routes/rest/api'));

	console.log("DB CONNECTED");
});

/*app.get('/', home.index);
app.get('/users', user.list);
app.use('/register', require('./routes/register'));*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
