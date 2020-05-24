//require dependencies
var express = require('express');
var router = express.Router();
var async = require('async');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

//const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
const database = process.env.DATABASE_URL || 8080;
const client = new MongoClient(database, { useNewUrlParser: true, useUnifiedTopology: true });

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'home', page: 'home', menuID: 'home' });
// });

router.get('/', function(req, res, next) {
  //connect to MongoDB database
  client.connect(err => {
    const db = mongoose.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 0,
      keepAlive: true,
    }).catch(err => console.log(err.reason));
    const bookshelf = client.db("books").collection("currently-readings");
      //res.json(result)
      console.log('MongoDB collection opened...')
    //pull data from MongoDB database
    return bookshelf.find().toArray()
        .then(result => {
        //console.log(result[0].bookArray[0].link)
        //render data in index.ejs
        res.render('index', {
          title : result[0].bookArray[0].title,
          link: result[0].bookArray[0].link,
          author : result[0].bookArray[0].authors.author.name,
          page: 'home', menuID: 'home'
        });
      })
    .catch(error => console.error(error))
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
router.get('/reading', function(req, res, next) {
  res.render('reading', { title: 'reading' });
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
  client.connect(err => {
    const db = mongoose.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 0,
      keepAlive: true,
    }).catch(err => console.log(err.reason));
    const bookshelf = client.db("test").collection("books");
      // perform actions on the collection object
      //res.json(result)
      console.log('MongoDB collection opened...')
    return bookshelf.find().toArray()
        .then(result => {
            //console.log(result[0].bookArray[0].link)
        res.render('test', {
          title : result[0].bookArray[0].title,
          link: result[0].bookArray[0].link,
          author : result[0].bookArray[0].authors.author.name,
          test: 'test'
        });
      })
    .catch(error => console.error(error))
  })
});

//send router to app.js
module.exports = router;
