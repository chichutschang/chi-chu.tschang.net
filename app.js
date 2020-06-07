require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
//var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var readingRouter = require('./routes/test');
var client = require('./db');
const database = process.env.DATABASE_URL
const request = require('request');

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
//app.use('/', readingRouter);
//console.dir(readingRouter);
app.use('/', indexRouter);
console.dir(indexRouter);
app.use('/users', usersRouter);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//set up MongoDB
client.connect(database, (err) => {
  if (err) {
    console.log('Unable to connect to MongoDB...')
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log('Listening on Port 3000 from app.js...');
    });
  }
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
