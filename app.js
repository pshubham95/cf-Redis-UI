var session = require('express-session');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var routes = require('./routes/index');
var login = require('./routes/login');
var navbarData = require('./routes/navBarData');
var dashboard = require('./routes/dashboard');
var getData = require('./routes/getRedisData');
var getKeyValue = require('./routes/getKeyValue');
var saveKeyValue = require('./routes/saveKeyValue');
var exportData = require('./routes/exportData');
var exportDataFile = require('./routes/exportDataFile');
var deleteKey = require('./routes/deleteKey');
var executeCommand = require('./routes/executeCommands');
var commandExecute = require('./routes/commandExecute');
var logout = require('./routes/logout');
var importData = require('./routes/importData');
var fileUpload = require('express-fileupload');

var app = express();
app.use(fileUpload());

app.all('*', function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use(session({secret: 'Shubham_123'}));
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/dashboard',dashboard);
app.use('/getData',getData);
app.use('/getKeyValue',getKeyValue);
app.use('/saveKeyValue',saveKeyValue);
app.use('/exportData',exportData);
app.use('/deleteKey',deleteKey);
app.use('/executeCommand',executeCommand);
app.use('/executeCommand',commandExecute);
app.use('/getNavBarData',navbarData);
app.use('/exportDataFile',exportDataFile);
app.use('/importData',importData);
app.use('/logout',logout);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('here');
  res.sendFile(path.join(__dirname,'public','404.html'));
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
