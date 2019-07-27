var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aws = require('aws-sdk');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//redirect http to https
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/insecure', function (req, res) {
  res.send('Dangerous!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080 insecurely!');
});

module.exports = app;
