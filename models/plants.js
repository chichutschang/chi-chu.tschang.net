//require dependencies
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://tschang:82H!ghland@plants-l7uuf.mongodb.net/plants?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

//Retrieve humidity data from MongoDB database and send to index.js
async function moisture(callback){
    try {
        client.connect(err => {
            let collection = client.db('tomato').collection('february2019');
            collection.find({ topic: 'sensor/moisture' }).sort({ time: 1 }).toArray((err, results) => {
                callback(err, results);
                console.log('Retrieved moisture data from MongoDB with plants.js...');
            });
        })
    } catch (err) {
        console.error(err);
    } 
    finally {
        client.close();
        console.log('Closed connection to MongoDB from plants.js...')
    }
}  

//Retrieve temperature data from MongoDB database and send to index.js
async function temperature(callback){
    try {
        client.connect(err => {
            let collection = client.db('tomato').collection('february2019');
            collection.find({ topic: 'sensor/temperature' }).sort({ time: 1 }).toArray((err, results) => {
                callback(err, results);
                console.log('Retrieved temperature data from MongoDB with plants.js...');
            });
        })
    } catch (err) {
        console.error(err);
    } 
    finally {
        client.close();
        console.log('Closed connection to MongoDB from plants.js...')
    }
}  

//Retrieve humidity data from MongoDB database and send to index.js
async function humidity(callback){
    try {
        client.connect(err => {
            let collection = client.db('tomato').collection('february2019');
            collection.find({ topic: 'sensor/humidity' }).sort({ time: 1 }).toArray((err, results) => {
                callback(err, results);
                console.log('Retrieved humidity data from MongoDB with plants.js...');
            });
        })
    } catch (err) {
        console.error(err);
    } 
    finally {
        client.close();
        console.log('Closed connection to MongoDB from plants.js...')
    }
}  

module.exports = {
    moisture,
    temperature,
    humidity
};