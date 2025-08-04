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
const { AAPLprice, AAPLPE, AAPLPS } = require('./aapl');
const { readAAPLdata } = require('./aapldata');
const { webfinger } = require('./webfinger');


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
        var dateread = moment(readbooks[i].review[j].read_at[0], 'ddd MMM DD HH:mm:ss Z YYYY').format('MM/DD/YYYY');
        //console.log(dateread)
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
router.get('/reading/update', async function (req, res) {
  try {
    await updateRead();
  //console.dir(updateDatabase);
  res.render('update', { title: 'update' });
} catch (err) {
  console.error(`Error updating read database: ${err}`);
  res.status(500).send('Error updating read database');
}
});

/* GET projects */
router.use('/projects', express.static(path.join(__dirname, '../public/observable'), {
  index: 'projects.html'
}));

//serve Observable Framework static assests
router.use('/public/_observablehq', express.static(path.join(__dirname, '../public/observable/_observablehq')));
router.use('/public/_file', express.static(path.join(__dirname, '../public/observable/_file')));

/* GET projects */
// router.get('/projects', async (req, res, next) => {
// try {
//   AAPLprice(),
//   AAPLPE(),
//   AAPLPS()
//   //trigger Observable rebuild
//   const {exec} = require('child_process');
//   exec('cd observable && npm run build', (error, stdout, stderr) =>{
//     if(error) console.error('Build error:', error);
//     console.log('Observable rebuilt with new data');
//     next()
//     });
//   } catch (error) {
//     console.error('Error updating AAPL data:', error);
//     next(error);
//   }
// }, express.static(path.join(__dirname, '../public/observable'), {
//   index: 'projects.html'
// }));
  //   const observablePath = path.join(__dirname, '../public/observable/projects.html');
  //check if the built file exists
  // if (fs.existsSync(observablePath)){
  //   res.sendFile(observablePath);
  // } else {
  //fallback if observable hasn't been built yet
  // res.status(500).send('Observable Framework has not been built yet. Please run cd observable && npm run build')
  // }
  // res.render('projects', { title: 'projects' });
// });

router.use('/projects/AAPL', async (req, res, next) => {
  try {
    /* GET AAPL */
    AAPLprice(), 
    AAPLPE(),
    AAPLPS()
  } catch (error) {
    console.error('Error updating AAPL data:', error);
    next(error);
  }}, express.static(path.join(__dirname, '../public/observable'), {
  index: 'AAPL.html'
  }));

/* GET projects/AAPL */
router.get('/projects/AAPL2', async (req, res)  => {
  AAPLprice(), AAPLPE(), AAPLPS()
  const { priceJsonData, peJsonData, psJsonData } = await readAAPLdata();
  //console.log(priceJsonData);
  //console.log(peJsonData);
  //console.log(psJsonData);
  const date = moment(priceJsonData[priceJsonData.length-1][0], 'YYYY-MM-DD').format('MM/DD/YYYY')
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
  // console.log('Retrieved data from json files')
  //pass the extracted data to AAPL.ejs view
  res.render('AAPL2', {
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
})

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

/* GET .well-known/webfinger page */
router.get('/.well-known/webfinger', async function(req, res) {
   try {
    const { webfingerData } = await webfinger();
    console.log(webfingerData);
    //set correct content type for webfinger
    res.setHeader('Content-Type', 'application/jrd+json');
    res.json(webfingerData)
  } catch (err) {
    console.error(`Error reading webfinger JSON file: ${err}`); 
    res.status(500).send('Error reading webfinger JSON file');
    }
});

module.exports = router;

