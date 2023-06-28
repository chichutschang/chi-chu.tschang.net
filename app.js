require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users');

const db = require('./db.js');
//var client = require('./db.js');
const database = process.env.DATABASE_URL;
const { MongoClient } = require('mongodb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  //set up MongoDB
  db.establishConnection()
    .then(() => {
      console.log('Connected to MongoDB from app.js...')
      next();
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB from app.js:', error)
      next(error);
    });
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
