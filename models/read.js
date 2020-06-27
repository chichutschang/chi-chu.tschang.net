//require dependencies
//require('dotenv').config()
var client = require('../db');
const async = require('async');

//Retrieve read books from MongoDB database and send to index.js
async function books(callback){
    try {
        let collection = client.db('test').collection('reads');
        await collection.find().sort({read_at : 1}).toArray((err, results) => {
            callback(err, results)
        });
    } catch(err) {
        console.error(err);
    } 
}  

module.exports = {
    books
};