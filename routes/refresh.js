require('dotenv').config()
const request = require('request');
const parseString = require('xml2js').parseString;
const { MongoClient } = require('mongodb');
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY;
const database = process.env.DATABASE_URL;
console.log(database)
const userID=process.env.userID;
const client = new MongoClient(database, {useUnifiedTopology: true})
//Goodreads XML URL
const currentlyreadURL = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=currently-reading'
console.log(client)

function currentlyreadingbook(){
    console.log(currentlyreadURL)
    let currentlyreadingcollection = client.connect(err => { db = client.db('books').collection('currently-reading')})
    //let currentlyreadingcollection = client.db('books').collection('currently-reading');
    request(currentlyreadURL, (error, req, book) => {
        //console.log(book)
        parseString(book, function (err, read) {
            //console.log(read)
            if (read.GoodreadsResponse.reviews[0]['$'].start == 0) {
                console.log('Need new book recommendations');
                }
            else{
                parseString(book, { attrkey: '@' }, function (err, read) {
                    console.dir(read.GoodreadsResponse.reviews)
                    //6. insert read books into MongoDB database
                    client.db('books').collection('currently-reading').insertMany(read.GoodreadsResponse.reviews)
                    
                    //currentlyreadingcollection.insertMany(read.GoodreadsResponse.reviews);
                    console.log('Inserted currently reading book collection into MongoDB...');
                });
            }
        })
    })      
}

currentlyreadingbook()