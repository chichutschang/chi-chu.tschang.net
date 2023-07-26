require('dotenv').config()
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const parseString = require('xml2js').parseString;
const dbname = "MongoDB"
//key, URL and UserID to access Goodreads API
const key = process.env.GOODREADS_KEY;
const database = process.env.DATABASE_URL;
const userID=process.env.userID;
const client = new MongoClient(database, {useUnifiedTopology: true});

//Goodreads XML URL
const readURL1 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=1'
const readURL2 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=2'
const readURL3 = 'https://www.goodreads.com/review/list/'+userID+'.xml?key='+key+'&v=2&shelf=read&per_page=200&page=3'

var urls = [readURL1, readURL2, readURL3]

const updateRead = async () => {
    try {
        //1. connect to MongoDB database 'reads' collection
        await client.connect();
        const readcollection = client.db('books').collection('reads');    
        //2. delete existing collection in MongoDB
        await readcollection.drop()
        console.log('Deleted read books collection in MongoDB...')
        //3. request read books from GoodReads XML
        for(let i = 0; i < urls.length; i++){
            await fetch(urls[i])
            //console.log(urls[i])
            .then(res => res.text())
            .then(books =>{
                //4. parse XML to JSON; change attrkey from '$' to something else so MongoDB accepts data
                parseString(books, {attrkey:'@'}, function (err, read){
                    //console.dir(read.GoodreadsResponse.reviews)
                    //5. insert read books into MongoDB database
                    readcollection.insertMany(read.GoodreadsResponse.reviews);
                    console.log(`Inserted read books from ${urls[i]} into MongoDB...`)
                    });
                })
                .catch(error => {
                    throw error;
                })
            }
            console.log('Update completed.');
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    }
}
updateRead()

module.exports = {
    updateRead
}
