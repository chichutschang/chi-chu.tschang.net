//require dependencies
require('dotenv').config()
var express = require('express');
var router = express.Router();
var insertcurrentlyreading = require('./currentlyreading');
var insertread = require('./read');
var moment = require('moment');
var client = require('../db');
let currentlyreading = require('../models/currentlyreading');
let read = require('../models/read');

/* GET home page. */
router.get('/', (req, res) => {
  //use routes/reading.js to check Goodreads for currently reading book
  req.on = insertcurrentlyreading
  //console.dir(insertcurrentlyreading);
  //set header to html
  res.setHeader('Content-Type', 'text/html');
  //retrieve currently reading book from MongoDB and render on index.ejs
  currentlyreading.book((err, result) =>{
    //console.dir(result);
    res.render('index', {
      title : result[result.length - 1].review[0].book[0].title[0],
      author:  result[result.length - 1].review[0].book[0].authors[0].author[0].name[0],
      link: result[result.length - 1].review[0].book[0].link[0],  
      page: 'home', menuID: 'home'
    });
  })
});

/* GET resume page. */
router.get('/resume', function(req, res, next) {
  res.render('resume', { title: 'resume' });
});

/* GET teaching page. */
router.get('/teaching/english9', function(req, res) {
  res.render('english9', { title: 'English 9' });
});

/* GET teaching page. */
router.get('/teaching/english10', function(req, res) {
  res.render('english10', { title: 'English 10' });
});

/* GET learning page. */
router.get('/learning', function(req, res, next) {
  res.render('learning', { title: 'learning' });
});

/* GET reading page. */
router.get('/reading', (req, res) => {
  //set header to html
  res.setHeader('Content-Type', 'text/html');
  //retrieve read books from MongoDB and render on reading.ejs
  read.books((err, result) => {
  //console.dir(result);
  const books = []
  for(var i =0; i < result.length; i++) {
      //console.log(result[i])
      for(var j=0; j < result[i].review.length; j++){
        //retrieve books' date read from MongoDB
        var dateread = moment(result[i].review[j].read_at[0]).format('MM/DD/YYYY')
        //retrieve books' Goodreads link rom MongoDB
        var link = result[i].review[j].book[0].link[0];
        //retrieve books' title from MongoDB          
        var title = result[i].review[j].book[0].title[0];
        //retrieve books' author from MongoDB          
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

/* GET reading/update page. */
router.get('/reading/update', function(req, res, next) {
  req.on = insertread;
  console.dir(insertread);
  res.render('update', { title: 'reading/update' });
});
  

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'projects' });
})

/* GET projects/plants page. */
router.get('/projects/plants', function(req, res, next){
  res.render('plants', {title: 'plants'});
})

/* GET projects/shotchart page. */
router.get('/projects/shotchart', function(req, res, next){
  res.render('shotchart', {title: 'shot chart'});
})

/* GET projects/censor-weibo page. */
router.get('/projects/censor-weibo', function(req, res, next){
  res.render('censor-weibo', {title: 'censor weibo'});
})

/* GET projects/investing. */
router.get('/projects/AAPL', function(req, res){
    res.render('AAPL', { title: 'AAPL' });
  })

//send router to app.js
module.exports = router;
