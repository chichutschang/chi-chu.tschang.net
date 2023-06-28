require('dotenv').config()
const database = process.env.DATABASE_URL;
const { MongoClient } = require('mongodb');
const client = new MongoClient(database);
const async = require('async');
const dbname = "MongoDB"

const connectToDatabase = async () => {
    try {
        await client.connect()
        const readcollection = client.db('books').collection('reads');
        console.log(`Connected to the ${dbname} database from models/read.js`)    
        const data = await readcollection.find().sort().toArray();
        return data;
        //console.log(data);
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    } 
}
connectToDatabase()

const books = async () => {
    try {
        const data = await connectToDatabase();
        return data;
        console.log(data);
    } catch (err) {
        console.error(`Error inserting document: ${err}`)
    } finally {
        await client.close()
        console.log('Closed connection to MongoDB from models/read...')
    }
}

module.exports = {
    books
};