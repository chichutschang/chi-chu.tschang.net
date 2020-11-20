// //require dependencies
// require('dotenv').config()
// const async = require('async');
// const MongoClient = require('mongodb').MongoClient;
// const database = process.env.PLANTS_DATABASE_URL;
// const settings = {
//     reconnectTries : Number.MAX_VALUE,
//     autoReconnect : true
//   };
// const client = new MongoClient(database, settings, { useNewUrlParser: true, useUnifiedTopology: true });

// //Retrieve humidity data from MongoDB database and send to index.js
// async function moisture(callback){
//     try {
//         client.connect(err => {
//             console.log('Opened connection to MongoDB from plants.js...');
//             let collection = client.db('basil').collection('july2020');
//             collection.find({ topic: 'sensor/moisture' }).sort({ time: 1 }).toArray((err, results) => {
//                 callback(err, results);
//                 console.log('Retrieved moisture data from MongoDB with plants.js...');
//             });
//         })
//     } catch (err) {
//         console.error(err);
//     } 
// }  

// //Retrieve temperature data from MongoDB database and send to index.js
// async function temperature(callback){
//     try { 
//         client.connect(err => {
//         console.log('Opened connection to MongoDB from plants.js...');
//         let collection = client.db('basil').collection('july2020');
//         collection.find({ topic: 'sensor/temperature' }).sort({ time: 1 }).toArray((err, results) => {
//             callback(err, results);
//             console.log('Retrieved temperature data from MongoDB with plants.js...');
//         });
//     })
//     } catch (err) {
//         console.error(err);
//     } 
// }  

// //Retrieve humidity data from MongoDB database and send to index.js
// async function humidity(callback){
//     try {
//         client.connect(err => {
//             console.log('Opened connection to MongoDB from plants.js...');
//             let collection = client.db('basil').collection('july2020');
//             collection.find({ topic: 'sensor/humidity' }).sort({ time: 1 }).toArray((err, results) => {
//                 callback(err, results);
//                 console.log('Retrieved humidity data from MongoDB with plants.js...');
//             });
//         })
//     } catch (err) {
//         console.error(err);
//     } 
// }  

// module.exports = {
//     moisture,
//     temperature,
//     humidity
// };