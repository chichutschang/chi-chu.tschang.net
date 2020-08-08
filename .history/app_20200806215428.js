require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon')
var logger = require('morgan');
//var ejsLayouts = require('express-ejs-layouts')
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var client = require('./db');
const database = process.env.BOOKS_DATABASE_URL;
const request = require('request');
var d3 = require('d3');

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
app.use(favicon(__dirname +'/public/images/favicon.ico'));
//set up routes/index.js for all pag
app.use('/', indexRouter);
//console.dir(indexRouter);
app.use('/users', usersRouter);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://doc-00-84-sheets.googleusercontent.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(createError(404));
});

// CORS header `Access-Control-Allow-Origin` set to accept all
app.use(cors());

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

