//require dependencies
require('dotenv').config()
var express = require('express');
var router = express.Router();
var request = require('request');
var insertcurrentlyreading = require('./currentlyreading');
var insertread = require('./read');
var insertgrow = require('./growing');
var moment = require('moment');
var client = require('../db');
let currentlyreading = require('../models/currentlyreading');
let read = require('../models/read');
let plants = require('../models/plants');

/* GET home page. */
router.get('/', (req, res) => {
  //set header to html
  res.setHeader('Content-Type', 'text/html');
  //use routes/reading.js to check Goodreads for currently reading book
  req.once = insertcurrentlyreading
  console.dir(insertcurrentlyreading);
  //retrieve currently reading book from MongoDB and render on index.ejs
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
router.get('/', function(req, res) {
  res.redirect('index', { title: 'home' });
});

/* GET resume page. */
router.get('/resume', function(req, res) {
  res.render('resume', { title: 'resume' });
});

/* GET learning page. */
router.get('/learning', function(req, res) {
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
router.get('/reading/update', function(req, res) {
  req.once = insertread;
  console.dir(insertread);
  res.render('update', { title: 'reading/update' });
});

/* GET investing page. */
router.get('/investing', function(req, res) {
  res.render('investing', { title: 'investing' });
});

/* GET projects page. */
router.get('/projects', function(req, res) {
  res.render('projects', { title: 'projects' });
});

/* GET projects/shotchart page. */
router.get('/projects/shotchart', function(req, res){
  res.render('shotchart', {title: 'shot chart'});
})

/* GET projects/censor-weibo page. */
router.get('/projects/censor-weibo', function(req, res){
  res.render('censor-weibo', {title: 'censor weibo'});
})

/* GET projects/plants. */
router.get('/projects/plants', function(req, res){
  plants.moisture((err, result) =>{
    var recent = result.length - 1
    //console.log(result[recent].value)

    res.render('plants', {
      moisture: result[recent].value,
      title: 'plants'
    });
  })
})

/* GET projects/plants/moisture. */
router.get('/projects/plants/moisture', function(req, res){
  res.set('Content-Type', 'application/json');
  res.set("Content-Security-Policy","img-src 'unsafe-inline' 'self'");
  // req.once = d3jsmoisture
  plants.moisture((err, result) => {
    //console.log(result)
    res.status(200).json(result);
    //res.render('moisture', {title: 'moisture'})
  })
})

/* GET projects/plants/temperature. */
router.get('/projects/plants/temperature', function(req, res){
  res.set('Content-Type', 'application/json');
  res.set("Content-Security-Policy","img-src 'unsafe-inline' 'self'");
  plants.temperature((err, result) => {
    //console.log(result)
    res.status(200).json(result);
    //res.render('humidity', {title: 'temperature'})
  })
})

/* GET projects/plants/humidity. */
router.get('/projects/plants/humidity', function(req, res){
  res.set('Content-Type', 'application/json');
  res.set("Content-Security-Policy","img-src 'unsafe-inline' 'self'");
  plants.humidity((err, result) => {
    //console.log(result)
    res.status(200).json(result);
    //res.render('humidity', {title: 'humidity'})
  })
})

/* GET connect page. */
router.get('/connect', function(req, res) {
  res.render('connect', { title: 'connect' });
});

/* GET test page. */
router.get('/test', function(req, res) {
  //res.setHeader('Content-Type', 'text/html');
  res.json(insertgrow)
  //console.log(insertgrow)
});

//send router to app.js
module.exports = router;
