
//require dependencies
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home', page: 'home', menuID: 'home' });
});

/* GET about page. */
router.get('/', function(req, res, next) {
  res.redirect('index', { title: 'home' });
});

/* GET resume page. */
router.get('/resume', function(req, res, next) {
  res.render('resume', { title: 'resume' });
});

/* GET learning page. */
router.get('/learning', function(req, res, next) {
  res.render('learning', { title: 'learning' });
});

/* GET reading page. */
router.get('/reading', function(req, res, next) {
  res.render('reading', { title: 'reading' });
});

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'projects' });
});

/* GET projects/shotchart page. */
router.get('/projects/shotchart', function(req, res, next){
  res.render('shotchart', {title: 'shot chart'});
})

/* GET projects/censor-weibo page. */
router.get('/projects/censor-weibo', function(req, res, next){
  res.render('censor-weibo', {title: 'censor weibo'});
})

/* GET connect page. */
router.get('/connect', function(req, res, next) {
  res.render('connect', { title: 'connect' });
});

/* GET test page. */
router.get('/test', function(req, res, next) {
  res.json({ title : 'Of Mice and Men' , author: 'John Steinbeck'});
});


module.exports = router;
