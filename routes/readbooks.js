const fetch = require('node-fetch');
var client = require('../db');
const { urls, parseString } = require("./read");
//Retrieve read books from Goodreads and insert into MongoDB database

async function readbooks() {
    try {
        //1. connect to MongoDB database 'reads' collection
        let readcollection = client.db('books').collection('read');
        //2. delete existing collection in MongoDB
        await readcollection.drop();
        console.log('Deleted read books collection in MongoDB...');
        //3. request read books from Goodreads XML
        for (let i = 0; i < urls.length; i++) {
            await fetch(urls[i])
                .then(res => res.text())
                .then(books => {
                    //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data     
                    parseString(books, { attrkey: '@' }, function (err, read) {
                        //console.dir(read.GoodreadsResponse.reviews)
                        //5. insert read books into MongoDB database
                        readcollection.insertMany(read.GoodreadsResponse.reviews);
                        console.log(`Inserted read books from ${urls[i]} into MongoDB...`);
                    });
                });
        }
        //create index in MongoDB             
        await readcollection.createIndex({read_at: 1 }, function (err, result) {
            console.log(`Created index ${result} in MongoDB...`);
        });
    }
    catch (err) {
        console.error(err);
    }
    finally {
        client.close;
        console.log('Closed connection to MongoDB...');
    }
}
