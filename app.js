require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var readingRouter = require('./routes/reading');
var app = express();
const goodreads = require('goodreads-api-node');
const request = require('request');
//const parser = require('xml2json');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passport = require('passport')

// set up view engine for views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up listen port
app.listen((app.get('port'), function (){
  console.log('Server has started....')
}))
//app.listen(process.env.PORT || 3000)

//set up folders to use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname +'/static', {dotfiles: 'allow'}));
app.use('/', indexRouter);
app.use('/', readingRouter);
console.dir(readingRouter)
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

module.exports = app;
