require('dotenv').config()
const database = process.env.DATABASE_URL;
//console.log(database);
const { MongoClient } = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
// let client = null;
//let mongodb;
//const client = new MongoClient(database)
//console.log(client);

const client = new MongoClient(database);
const dbname = "books"

//connect to MongoDB database
const connectToDatabase = async () => {
    try {
        //Connect the client to the server
        await client.connect()
        console.log(`Connected to MongoDB databases from db.js:`);
        //console.log(client)
    } catch (err) {
        console.error(`Error connecting to MongoDB ${dbname} database: ${err}`);
    }
};

//
const establishConnection = async () => {
    try {
        await connectToDatabase();
        const databasesList = await client.db().admin().listDatabases();
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        //console.log(client.db('books').collection('currently-reading'));
    } catch (err) {
        console.error(`Error connecting to MongoDB ${dbname} database: ${err}`);
    } finally {
        await client.close();
    }   
}

//Run the main function
establishConnection();

//export the data
module.exports = {
    establishConnection    
}

//Retrieve currently reading book from MongoDB database and send to index.js
// async function book(callback){
//     try {
//         let collection = client.db('books').collection('currently-reading');
//         collection.find().sort({read_at : 1}).toArray((err, results) =>{
//             callback(err, results)
//             console.log(results);
//         });
//     } catch(err){
//         console.error(err);
//     }
// }

// async function connect() {
//     try {
//         //Connect the client to the server
//         await client.connect()
//         //Send a ping to confirm a successful connection
//         await client.db("admin").command({ping:1});
//         console.log("Connected to MongoDB from db.js...");
//         //console.log(client)
//     } finally {
//         //Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// connect().catch(console.dir);

// function connect(callback){
//     MongoClient.connect(database, (err, db) => {
//         mongodb = db;
//         console.log(mongdob)
//         callback();
//         console.log("Connected to MongoDB from db.js...");
//     })
// }

// function get() {
//     return mongodb;
// }

// function close() {
//     mongodb.close();
// }

//let connection;
//function connect(database, callback) {
// module.exports.connect = function(database, callback) {
//     if (client) {
//         //Connection has already been established
//         callback();
//         console.log('Connected to MongoDB from db.js...');
//     }
    //Create a MongoDB client
    // client = new MongoClient(database, {useUnifiedTopology: true});
    // console.log(client);
    //     client.connect(function(err){
    //         if(err){
    //         //Error occurred during connection
    //         client = null;
    //         callback(err);
    //     } else {
    //         //Connected to MongoDB
    //         callback();
    //         console.log("Connected to MongoDB from db.js...");
    //        }
    //     });

    // console.log(client.db('books').collection('currently-reading'))
//}

// //check if MongoDB is connected
// function isConnected() {
//     return !!client && !!client.topology && client.topology.isConnected()
// }

// async function init() {
//     console.log(client.isConnected()); //false
//     await client.connect();
//     console.log(client.isConnected()); //true
// }
// init();

//Get MongoDB using pre-established connection
// module.exports.db = function(dbName){
//     return client.db(dbName);
// }

//Close open connection
// module.exports.close = function() {
//     if(client) {
//         client.close();
//         client = null;
//     }
// }
// function connect(database, callback){
//    if (client == null){
//         //Create a MongoDB client
//         client = new MongoClient(database, {useUnifiedTopology: true});
//         //console.log(client);
// //         //Establish a connection
//         client.connect()
//         console.log('Connected to MongoDB from db.js...');
//         // client.connect((err) => {
        //     if (err) {
                //Error occurred during connection
                // client = null;
                // callback(err);
//                 process.exit(1);
            // } else {
//                 //Connected to MongoDB
                // callback();
                // console.log('Connected to MongoDB from db.js...');
        //     }
        // })
//     } else {
//         //Connection was established earlier. Just call callback()
//         callback();
//         console.log('Connected to MongoDB from db.js...');
//     } 
//}

// //Get MongoDB using pre-established connection
// function db(dbName){
//     return client.db(dbName);
// }

// function close(){
//     if(client){
//         client.close();
//         client = null;
//     }
// }

// module.exports = {
//     connect
// //     get,
// //     close
// };

