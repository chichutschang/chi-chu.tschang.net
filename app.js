var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var corsOptions = {
//   origin: 'http://127.0.0.1:3000',
//   optionsSuccessStatus: 200
// }
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


//enable all cors requests
// app.use(cors({
//   origin: 'http://127.0.0.1:3000'
// }));

// app.get('/products/:id', cors(corsOptions), function(req, res, next){
//     res.json({msg: 'This is a CORS-enabled for all origins!'})
// })

// app.listen(80, function(){
//   console.log('CORS-enabled web server listening on port 80')
// })

module.exports = app;
