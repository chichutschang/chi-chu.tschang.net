//require dependencies
require('dotenv').config()
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const app = express();
var router = express.Router();
const parseString = require('xml2js').parseString;
var client = require('../db');
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY;
const database = process.env.DATABASE_URL;
const userID=process.env.userID;
//Goodreads XML URL
const currentlyreadURL = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=currently-reading'

//Retrieve currently reading book from Goodreads and insert into MongoDB database
async function currentlyreadingbook() {
    try {
        //1. connect to MongoDB database 'currently-reading' collection
        let currentlyreadingcollection = client.db('books').collection('currently-reading');
            //2. request read books from Goodreads XML
            //console.log(currentlyreadURL)
            request(currentlyreadURL, (error, req, book) => {
                parseString(book, function (err, read) {
                    //3. check if there is book on currently reading shelf on Goodreads                   
                    if (read.GoodreadsResponse.reviews[0]['$'].start == 0) {
                    console.log('Need new book recommendations');
                    }
                    else {
                        //4. delete existing collection in MongoDB
                        currentlyreadingcollection.drop();
                        console.log('Deleted currently reading book collection in MongoDB...')
                            //5. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data
                            parseString(book, { attrkey: '@' }, function (err, read) {
                                //console.dir(read.GoodreadsResponse.reviews)
                                //6. insert read books into MongoDB database
                                currentlyreadingcollection.insertMany(read.GoodreadsResponse.reviews);
                                console.log('Inserted currently reading book collection into MongoDB...');
                            });
                    }
                });
            })
    } catch (err) {
        console.error(err)
    } finally {
        client.close
        console.log('Closed connection to MongoDB...')
    }
}

module.exports = async (req, res) => {
    const currentlyreading = currentlyreadingbook()
    return {
        currentlyreading
    }
};