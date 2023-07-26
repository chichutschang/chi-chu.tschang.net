var express = require('express');
var app = express();
var router = express.Router();
var moment = require('moment');
var fs = require('fs');
const path = require('path');
const { book } = require('../models/currentlyreading');
const { books } = require('../models/read');
const { updateRead } = require('./read');
const { updateCurrentlyReading } = require('./currentlyreading');
const { refreshDatabase } = require('./currentlyreading');
const { AAPL } = require('./aapl');

/* GET home page. */
router.get('/', async (req, res) => {
  updateCurrentlyReading(),
  refreshDatabase()
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

/* GET projects/AAPL */
router.get('/projects/AAPL', (req, res)  => {
  //read AAPLprice, AAPLPE & AAPLPS data from 3 json files asynchronousesly
  const readFiles = async () => {
    try {
      const [priceData, peData, psData] = await Promise.all(
        [
          readFileAsync('./public/graphs/AAPLprice.json', 'utf8'),
          readFileAsync('./public/graphs/AAPLPE.json', 'utf8'),
          readFileAsync('./public/graphs/AAPLPS.json', 'utf8'),
        ]
      );
      const priceJsonData = JSON.parse(priceData);
      //console.log(priceData[priceData.length-1]);
      const peJsonData = JSON.parse(peData);
      //console.log(peJsonData[peJsonData.length-1]);
      const psJsonData = JSON.parse(psData);
      //console.log(psJsonData[psJsonData.length-1]);
      const date = peJsonData[peJsonData.length-1][0]
      //console.log(date)
      const price = priceJsonData[priceJsonData.length-1][1]
      //console.log(price)
      const pe = peJsonData[peJsonData.length-1][1]
      //console.log(pe)
      const PEmean = peJsonData[peJsonData.length-1][2]
      const PEplus2stddev = peJsonData[peJsonData.length-1][3]
      const PEplus1stddev = peJsonData[peJsonData.length-1][4]
      const PEminus1stddev = peJsonData[peJsonData.length-1][5]
      const PEminus2stddev = peJsonData[peJsonData.length-1][6]
      const ps = psJsonData[psJsonData.length-1][1]
      //console.log(ps)
      const PSmean = psJsonData[psJsonData.length-1][2]
      //console.log(PSmean)
      const PSplus2stddev = psJsonData[psJsonData.length-1][3]
      //console.log(PSplus2stddev)
      const PSplus1stddev = psJsonData[psJsonData.length-1][4]
      //console.log(PSplus1stddev)
      const PSminus1stddev = psJsonData[psJsonData.length-1][5]
      const PSminus2stddev = psJsonData[psJsonData.length-1][6]
      console.log('Retrieved data from json files')
      //pass the extracted data to AAPL.ejs view
      res.render('AAPL', {
        date: date,
        price: price,
        pe: pe,  
        PEmean: PEmean,
        PEplus2stddev: PEplus2stddev,
        PEplus1stddev: PEplus1stddev,
        PEminus1stddev: PEminus1stddev,
        PEminus2stddev: PEminus2stddev,
        ps: ps,
        PSmean: PSmean,
        PSplus2stddev: PSplus2stddev,
        PSplus1stddev: PSplus1stddev,
        PSminus1stddev: PSminus1stddev,
        PSminus2stddev: PSminus2stddev
        })

    } catch (err) {
      console.error(err);
      return res.status(500).send('Error reading JSON files')
    }
  };

  //helper function to read files asynchronously
  const readFileAsync = (path, encoding) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, encoding, (err, data) => {
        if(err) reject(err);
        else resolve(data);
      });
    });
  };
  //call the async function to read files and render the view
  readFiles();
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
