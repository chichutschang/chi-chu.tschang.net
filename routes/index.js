var express = require('express');
var app = express();
var router = express.Router();
var moment = require('moment');
const { book } = require('../models/currentlyreading');
const { books } = require('../models/read');
const { updateRead } = require('./read');
const { updateCurrentlyReading } = require('./currentlyreading');

/* GET home page. */
router.get('/', async (req, res) => {
  updateCurrentlyReading()
  //set header to html
  res.setHeader('Content-Type', 'text/html');
  //retrieve currently reading book from MongoDB and render on index.ejs
  try {
    //retrieve books from models/currentlyreading.js
    const books = await book();
    // console.log(books.length)
    //get author of book
    const author = books[books.length-1].review[0].book[0].authors[0].author[0].name[0]
    //get title of book
    const title = books[books.length-1].review[0].book[0].title[0]
    //get Goodreads URL link of book
    const link = books[books.length-1].review[0].book[0].link[0]
    //render title, author and URL link on index.ejs
    res.render('index', {
      title : title,
      author : author,
      link : link,
      page: 'home', menuID: 'home'
    })
    //console.log({books});   
  } catch(err){
    console.error('Error', err);
  }
});

/* GET resume. */
router.get('/resume', function(req, res) {
  res.render('resume', { title: 'resume' });
});

/* GET learning. */
router.get('/learning', function(req, res) {
  res.render('learning', { title: 'learning' });
});

/* GET teaching/english9. */
router.get('/teaching/english9', function(req, res) {
  res.render('english9', { title: 'English 9 Honors' });
});

/* GET teaching/english10. */
router.get('/teaching/english10', function(req, res) {
  res.render('english10', { title: 'English 10 Honors' });
});

/* GET reading. */
router.get('/reading', async (req, res) => {
  //set header to html
  res.setHeader('Content-Type', 'text/html');
  try {
    //retrieve books from models/read.js
    const readbooks = await books();
    //console.log(readbooks.length)
    const bookshelf = []
    for(var i= 0; i < readbooks.length; i++) {
      for (var j=0; j < readbooks[i].review.length; j++) {
        //get date read
        var dateread = moment(readbooks[i].review[j].read_at[0]).format('MM/DD/YYYY');
        //get Goodreads URL link of book
        var link = readbooks[i].review[j].book[0].link[0];
        //get title of book
        var title = readbooks[i].review[j].book[0].title[0];
        //get author of book
        var author = readbooks[i].review[j].book[0].authors[0].author[0].name[0];
        bookshelf.push({'dateread' : dateread, 'link' : link, 'title' : title , 'author' : author})
        //console.log(bookshelf)
      } 
    }
    res.render('reading', {
      bookshelf: bookshelf,
      title: 'reading'
    })
  } catch(err) {
    console.error('Error', err);
  }
})

/*GET reading/update page */
router.get('/reading/update', function(req, res){
  updateRead();
  console.dir(updateDatabase);
  res.render('update', {title: 'reading/update'});
});

/* GET projects */
router.get('/projects', function(req, res) {
  res.render('projects', { title: 'projects' });
});

/* GET projects/plants */
router.get('/projects/plants', function(req, res) {
  res.render('plants', { title: 'plants' });
});

/* GET projects/shotchart */
router.get('/projects/shotchart', function(req, res) {
  res.render('shotchart', { title: 'shot chart' });
});

/* GET projects/censor-weibo */
router.get('/projects/censor-weibo', function(req, res) {
  res.render('censor-weibo', { title: 'censor weibo' });
});

module.exports = router;
