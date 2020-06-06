require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
let client = null;
const database = process.env.DATABASE_URL || 8080;

function connect(url, callback){
    if (client == null){
        //Create a MongoDB client
        client = new MongoClient(url, {useUnifiedTopology: true});
        //Establish a connection
        client.connect((err) => {
            if (err) {
                //Error occurred during connection
                client = null;
                callback(err);
            } else {
                //Connected to MongoDB
                callback();
                console.log('Connected to MongoDB from db.js...');
            }
        })
    } else {
        //Connection was established earlier. Just call callback()
        callback();
        console.log('Connected to MongoDB from db.js...');
    }
}

//Get MongoDB using pre-established connection
function db(dbName){
    return client.db(dbName);
}

 function close(){
     if(client){
        client.close();
        client = null;
     }
}

module.exports = {
    connect,
    db,
    close
};