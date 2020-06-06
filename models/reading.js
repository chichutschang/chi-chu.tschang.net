var client = require('../db');

function books(callback){
    let collection = client.db('books').collection('reads');
        collection.find().sort({read_at : 1}).toArray((err, results) => {
            callback(err, results)
        });
}  

module.exports = {
    books
};