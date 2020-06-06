//require dependencies
require('dotenv').config()
const parseString = require('xml2js').parseString;
var client = require('../db');
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY
const database = process.env.DATABASE_URL || 8080;
const userID='1589736';
//Goodreads XML URL
const currentlyreadURL = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=currently-read'
const readURL1 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=1'
const readURL2 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=2'
const readURL3 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=3'

function Goodreads(callback){
    //1. connect to MongoDB database 'reads' collection
    const collection = client.db('books').collection('reads');
        //2. delete existing collection in MongoDB
        collection.drop()              
            //3. request read books from Goodreads XML
            //request(readURL3, (error, req, result) => {
            //console.log(result);
                //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data
                //parseString(result, {attrkey:'@'}, function (err, read) {
                //console.dir(read.GoodreadsResponse.reviews)
                    //5. insert read books into MongoDB database
                    //collection.insertMany(read.GoodreadsResponse.reviews);
                    //console.log('Inserted books 3 into MongoDB...')
                //})
            //})
            //3. request read books from Goodreads XML
            request(readURL1, (error, req, result) =>{
            //console.log(result);
                //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data                
                parseString(result, {attrkey:'@'}, function (err, read) {
                //console.dir(read.GoodreadsResponse.reviews) 
                    //5. insert read books into MongoDB database
                    collection.insertMany(read.GoodreadsResponse.reviews);
                    console.log('Inserted read books 1 into MongoDB...')
                })      
            })    
            //3. request read books from Goodreads XML
            request(readURL2, (error, req, result) =>{
            //console.log(result);
                //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data                   
                parseString(result, {attrkey:'@'}, function (err, read) {
                //console.dir(read.GoodreadsResponse.reviews) 
                    //5. insert read books into MongoDB database
                    collection.insertMany(read.GoodreadsResponse.reviews);
                    console.log('Inserted read books 2 into MongoDB...')
                })
            })
    //1. connect to MongoDB database 'currently-reading' collection
    collection = client.db('books').collection('currently-reading');
        //2. delete existing collection in MongoDB
        collection.drop()    
            //3. request read books from Goodreads XML
            request(currentlyreadURL, (error, req, result) => {
            //console.log(result);
                //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data
                parseString(result, {attrkey:'@'}, function (err, read) {
                //console.dir(read.GoodreadsResponse.reviews)
                    //5. insert read books into MongoDB database
                    collection.insertMany(read.GoodreadsResponse.reviews);
                    console.log('Inserted currently reading book into MongoDB...')
                })
            })
}

module.exports = {
    Goodreads
};