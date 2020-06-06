var client = require('../db');

function book(callback){
    let collection = client.db('books').collection('currently-reading');
        collection.find().sort({read_at : 1}).toArray((err, results) =>{
            callback(err, results)
        });
}

module.exports = {
    book
};