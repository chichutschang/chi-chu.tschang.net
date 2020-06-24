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
const readURL1 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=1'
const readURL2 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=2'
const readURL3 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=3'

var urls = [readURL1, readURL2, readURL3]

//Retrieve read books from Goodreads and insert into MongoDB database
async function readbooks() {
    try {
        //1. connect to MongoDB database 'reads' collection
        let readcollection = client.db('books').collection('reads');
            //2. delete existing collection in MongoDB
            readcollection.drop()    
            console.log('Deleted read books collection in MongoDB...')
                //3. request read books from Goodreads XML
                for (let i = 0; i < urls.length; i++){
                    await fetch(urls[i])
                        .then(res => res.text())
                        .then(books => {
                            //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data     
                            parseString(books, {attrkey:'@'}, function (err, read) {
                            //console.dir(read.GoodreadsResponse.reviews)
                            //5. insert read books into MongoDB database
                            readcollection.insertMany(read.GoodreadsResponse.reviews);
                            console.log('Inserted read books into MongoDB...')
                            });
                        })
                    //))
                    console.log(urls[i])
                }            
            readcollection.createIndex({read_at: 1})
            console.log('Created index in MongoDB...')        
    } catch (err) {
        //alert(err);
    }                
}

module.exports = async (req, res) => {
    const read = readbooks()
    return {
        read
    }
};