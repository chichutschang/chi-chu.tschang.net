//require dependencies
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://tschang:82H!ghland@plants-l7uuf.mongodb.net/plants?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

//Retrieve read books from MongoDB database and send to index.js
function plants(callback){
    try {
        client.connect(err => {
            let collection = client.db('tomato').collection('february2019');
            collection.find({ topic: 'sensor/moisture' }).toArray((err, results) => {
                callback(err, results);
            });
        })
    } catch(err) {
        console.error(err);
    } finally {
        client.close();
    }
}  

module.exports = {
    plants
};