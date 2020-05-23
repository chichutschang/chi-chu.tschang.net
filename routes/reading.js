require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
//const passport = require('passport')
const app = express();
//const cors = require('cors');
const path = require('path');
const goodreads = require('goodreads-api-node');
const async = require('async');
const request = require('request');
const parseXML = require('xml2js');
//const MongoClient = require('mongodb').MongoClient;

//key and secret to access Goodreads API
const credentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET
};
const gr = goodreads(credentials)
const callbackURL = 'http://127.0.0.1:8081/reading/goodreads'
const userID='1589736';
//const url ='mongodb://localhost:27017'
const database = process.env.DATABASE_URL || 8080;
console.log(database)
//const dbName = 'shelves'

const db = mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

//const db = mongoose.connect(database, (err, client) => {
  //if (err) console.log('Error in Mongoose Connect...', err)
  //else if (client) console.log('Connected to Mongo Database...')
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
  //});

//define schema
const Schema = mongoose.Schema;
const books = new Schema({
  bookArray: Array
});

//define models
const bookshelf = mongoose.model('currently-reading', books)

//URL to redirect after OAuth
gr.initOAuth(callbackURL)
console.log('getting callback URL...')

//gets user shelves from goodreads-api-node
//gr.getUsersShelves(userID)
//   .then((result) => {console.log(result)});

//code to send 'currently reading' shelf from Goodreads to index.ejs

//1. redrect oauth token to https://goodreads.com/oauth/authorize?
app.get('/', async (req, res, next) => {
  //request Token from Goodreads
  await gr.getRequestToken()
    .then(url => {
      res.redirect(url);
      console.log(url);
    });
})
//2. receive Token from Goodreads
app.get('/reading/goodreads', async (req, res, next) => {
  const requestToken = req.query
  console.log(requestToken)
  const accessToken = requestToken.get_access_token
  await gr.getAccessToken()
    .then(() => {
      //3. get book from Goodreads' currently reading shelf with Token
      gr.getBooksOnUserShelf(userID, 'currently-reading', {per_page: 200})
             .then((result) => {
               //display book information from Goodreads
               console.log(result.books.book)
               //display MongoDB database information
               console.log(mongoose.connection.db.collection('books'))
               //4. delete existing books from MongoDB collection
               mongoose.connection.db.dropCollection('currently-readings', (err, result) => {
                  console.log('Deleting existing books from MongoDB collection...')
                  if (err) console.log('Drop collection error', err)
                })

                //save data to MongoDB database
                const shelf = new bookshelf({bookArray: result.books.book})
                //insert books JSON object into MongoDB database
                shelf.save(function (err){
                    if (err) res.send('Error saving books from Goodreads...', err, i);
               })
               console.log('Saved currently reading book into MongoDB collection...')
               mongoose.connection.on('connected', function(){
                 setTimeout(function(){ done()}, 3000);
               })
          })

      //get books from read shelf
      //gr.getBooksOnUserShelf(userID, 'read', {per_page: 200})
      //      .then((result) => {console.log(result.books.book)})

    })
    .catch((err) => console.log('/auth/goodreads catch err', err))
});

app.listen(8081)