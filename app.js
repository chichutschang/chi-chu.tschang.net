require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var client = require('./db');
const database = process.env.DATABASE_URL;
const request = require('request');

// set up view engine for views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up MongoDB
client.connect(database, (err) => {
  if (err) {
    console.log('Unable to connect to MongoDB...')
    console.err(err);
    process.exit(1);
  } else {
    console.log('Connected to MongoDB from app.js...')
  }
});

//set up folders to use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname +'/static', {dotfiles: 'allow'}));
//set up routes/index.js for all pages
app.use('/', indexRouter);
//console.dir(indexRouter);
app.use('/users', usersRouter);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//respond with 204 error code (no content) when getting favicon.ico
app.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204); 
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

