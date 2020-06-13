//require dependencies
require('dotenv').config()
var express = require('express');
var router = express.Router();
var readingRouter = require('./reading');
//var async = require('async');
var moment = require('moment');
var client = require('../db');
let currentlyreading = require('../models/currentlyreading');
let reading = require('../models/read');

/* GET home page. */
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  currentlyreading.book((err, result) =>{
    //console.dir(result);
    res.render('index', {
      title : result[0].review[0].book[0].title[0],
      author:  result[0].review[0].book[0].authors[0].author[0].name[0],
      link: result[0].review[0].book[0].link[0],  
      page: 'home', menuID: 'home'
    });
  })
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
router.get('/reading', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  reading.books((err, result) => {
  //console.dir(result);
  const books = []
  for(var i =0; i < result.length; i++) {
      //console.log(result[i])
      for(var j=0; j < result[i].review.length; j++){
        //console.log(moment(result[i].review[j].read_at[0]).format('MM/DD/YYYY'));
        var dateread = moment(result[i].review[j].read_at[0]).format('MM/DD/YYYY')
        //console.log(result[i].review[j].book[0].link[0]);
        var link = result[i].review[j].book[0].link[0];
        //console.log(result[i].review[j].book[0].title[0]);          
        var title = result[i].review[j].book[0].title[0];
        //console.log(result[i].review[j].book[0].authors[0].author[0].name[0]);          
        var author = result[i].review[j].book[0].authors[0].author[0].name[0];
        //Push book title, author, link, dateread into array
        books.push({'dateread': dateread , 'link' : link , 'title' : title , 'author' : author} )
        //console.dir(books)
      }
    }
    //Render data in reading.ejs
    //res.status(200).json(result);
    res.render('reading', {
      books : books,
      title: 'reading'
    });
  })
});

/* GET reading page. */
router.get('/reading/goodreads', function(req, res, next) {
  res.render('goodreads', { title: 'reading/goodreads' });
});

/* GET investing page. */
router.get('/investing', function(req, res, next) {
  res.render('investing', { title: 'investing' });
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
  res.setHeader('Content-Type', 'text/html');
  currentlyreading.book((err, result) =>{
    //console.dir(result);
    res.render('index', {
      title : result[0].review[0].book[0].title[0],
      author:  result[0].review[0].book[0].authors[0].author[0].name[0],
      link: result[0].review[0].book[0].link[0],  
      page: 'home', menuID: 'home'
    });
  })
});

//send router to app.js
module.exports = router;
