require('dotenv').config()
const database = process.env.DATABASE_URL;
//console.log(database);
const { MongoClient } = require('mongodb');

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
