//require dependencies
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tschang:82H!ghland@plants-l7uuf.mongodb.net/plants?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//var data;
function grow(){
  client.connect(err => {
    const collection = client.db("tomato").collection("february2019");
    // perform actions on the collection object
    //console.dir(collection);
    return collection
    //client.close();    
  });  
}

grow();

module.exports = router;