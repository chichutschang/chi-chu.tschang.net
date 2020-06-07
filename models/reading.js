//require dependencies
require('dotenv').config()
var client = require('../db');
const async = require('async');
const fetch = require('node-fetch');
const request = require('request');
const parseString = require('xml2js').parseString;
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY
const database = process.env.DATABASE_URL || 8080;
const userID= process.env.userID;
//Goodreads XML URL
var urls = [ 
    'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=1',
    'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=2']

//Retrieve read books from Goodreads and insert into MongoDB database
async function readbooks() {
    try{
        //1. connect to MongoDB database 'reads' collection
        let collection = client.db('books').collection('reads');
            //2. delete existing collection in MongoDB
            collection.drop()              
                //3. request read books from Goodreads XML
                await Promise.all(urls.map(url =>
                    fetch(url)
                        .then(res => res.text())
                        .then(result => {
                            //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data     
                            parseString(result, {attrkey:'@'}, function (err, read) {
                            console.dir(read.GoodreadsResponse.reviews)
                            //5. insert read books into MongoDB database
                            collection.insertMany(read.GoodreadsResponse.reviews);
                            console.log('Inserted read books into MongoDB...')
                            });
                        })
                ))
    }   catch(err) {
        console.error(err);
    }
}

//Retrieve read books from MongoDB database and send to index.js
async function books(callback){
    try {
        let collection = client.db('books').collection('reads');
        await collection.find().sort({read_at : 1}).toArray((err, results) => {
            callback(err, results)
        });
    } catch(err) {
        console.error(err);
    } 
}  

module.exports = {
    readbooks,
    books
};