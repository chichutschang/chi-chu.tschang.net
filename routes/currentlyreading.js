require('dotenv').config()
const database = process.env.DATABASE_URL;
const { MongoClient } = require('mongodb');
const client = new MongoClient(database);
const request = require('request');
const parseString = require('xml2js').parseString;
const dbname = "MongoDB"
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY;
const userID=process.env.userID;
//Goodreads XML URL
const currentlyreadURL = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=currently-reading'
console.log(currentlyreadURL)
//const currentlyreadingcollection = client.db('books').collection('currently-reading');

const refreshDatabase = async () => {
    try {
        await client.connect()
            //1. connect to MongoDB database 'currently-reading' collection
            const currentlyreadingcollection = client.db('books').collection('currently-reading');
            //console.log(`Connected to the ${dbname} database from routes/currentlyreading.js`)    
            //2. count number of books in 'currently-reading' collection in MongoDB
            const count = await currentlyreadingcollection.countDocuments()
            //console.log(count);
            const filter = {read_count: {$ne: '0'}}
            //3. delete all but one entry after 100 entries
            if (count > 99) {
                currentlyreadingcollection.deleteMany(filter)
                console.log('Deleted all but one books from MongoDB currently reading...')
            }
    } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
    }
}
refreshDatabase()

const updateCurrentlyReading = async () => {
    try {
        //1. connect to MongoDB database 'currently-reading' collection
        await client.connect()
        const currentlyreadingcollection = client.db('books').collection('currently-reading');
        //console.dir(currentlyreadingcollection);
        console.log(`Connected to the ${dbname} database from routes/currentlyreading.js`)    
        //2. request currently reading books from Goodreads XML
        request(currentlyreadURL, (error, req, book) =>{
        //console.log(book);
        //3. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data
        parseString(book, {attrkey: '@' }, function(err, read){
            console.log(read.GoodreadsResponse.reviews);
            //console.dir(read.GoodreadsResponse.reviews)
            currentlyreadingcollection.insertMany(read.GoodreadsResponse.reviews);
            console.log('Inserted currently reading book collection into MongoDB')
            })
        })
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    }
} 
updateCurrentlyReading()

module.exports = {
    refreshDatabase,
    updateCurrentlyReading
}
