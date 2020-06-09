var client = require('../db');
const async = require('async');

//Retrieve currently reading book from MongoDB database and send to index.js
async function book(callback){
    try {
        let collection = client.db('books').collection('currently-reading');
        collection.find().sort({read_at : 1}).toArray((err, results) =>{
            callback(err, results)
        });
    } catch(err){
        console.error(err);
    }
}

module.exports = {
    book
};