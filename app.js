var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron');
var { exec } = require('child_process');
var fs = require('fs').promises;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { AAPLprice, AAPLPE, AAPLPS } = require('./routes/aapl')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// lets /projects/AAPL resolve to /projects/AAPL.html
app.use(express.static(path.join(__dirname, 'observable/dist'), { extensions: ['html'] , index: false}));
// also serve dist assets under /projects/AAPL so relative paths resolve
app.use('/projects/AAPL', express.static(path.join(__dirname, 'observable/dist'), {index: false}));
// also serve dist assets under /projects/travel so relative paths resolve
app.use('/projects/travel', express.static(path.join(__dirname, 'observable/dist'), {index: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const observablePath = path.join(__dirname, 'observable');
const distPath = path.join(observablePath, 'dist');
const cachePath = path.join(observablePath, 'src/.observablehq/cache');
const foursquareCache = path.join(cachePath, 'data/foursquare.json');

async function buildObservable() {
  try {
    await fs.rm(distPath, {recursive: true, force: true});
    console.log('[Observable Build] dist/ deleted');
  } catch (err){
    console.error('[Observable Build] Error deleting dist/:', err);
  }

  return new Promise((resolve) => {
    exec('npx observable build', { cwd: observablePath} , (err, stdout, stderr) => {
        if (err) {
          console.error('[Observable Build] Build FAILED:', err);
          console.error('[Observable Build stderr:', stderr);
          return resolve();
        } 
        console.log('[Observable Build] Build suceeded:');
        console.log(stdout);
        resolve();
    });
  });
}

//deletes AAPL-related 'dist' and 'cache' files and rebuilds Observable Framework at 3:00 PM, Monday-Friday, in America/Los_Angeles time
async function rebuildObservable() {
  console.log('[Observable Rebuild Starting at', new Date().toISOString());
  
  try {
    await Promise.all([AAPLprice(), AAPLPE(), AAPLPS()]);
    console.log('[Observable Rebuild] Google Sheets data synced');
  } catch (err) {
    console.error('[Observable Rebuild] Error syncing Google Sheets data:', err);
  }
  await buildObservable();
}
cron.schedule('0 15 * * 1-5', rebuildObservable, {
  timezone: "America/Los_Angeles"
});

//invalidates the foursquare data loader's cache so it re-fetches from the Foursquare API on the next build then rebuilds at 3:00 AM on the 1st of every month, America/Los_Angeles time
async function updateTravel() {
  console.log('[Travel Update] starting at', new Date().toISOString());

  try {
    await fs.rm(foursquareCache, {force: true});
    console.log('[Travel Update Starting at', new Date().toISOString());
  } catch (err) {
    console.error('[Travel Update] Error deleting foursquare cache:', err);
  }
  await buildObservable();
  console.log('[Travel Update] Done');
}
cron.schedule('0 3 1 * *', updateTravel, {
  timezone: "America/Los_Angeles"
});

// rebuildObservable();
// updateTravel()

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
