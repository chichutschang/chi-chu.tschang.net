//require dependencies
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tschang:82H!ghland@plants-l7uuf.mongodb.net/plants?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//var data;
function grow(callback){
  client.connect(err => {
    let collection = client.db("tomato").collection("february2019");
      // perform actions on the collection object
      //console.dir(collection['s'])
      collection.find({topic: 'sensor/moisture'}).toArray((err, results) => {
      //return data
        for (var i = 0; i < results.length; i++){
          
          //console.log(results)
          //console.log(results[i].value)
          //console.log(results[i].time)
          }  
      })
      // .then(results => {
      //   return results
      // })
      // .catch(error => console.error(error))
    });

    //return collection
    //client.close();    
  //});  
}

grow();

module.exports = router;