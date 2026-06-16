
const data1 = "./public/graphs/AAPLprice.json"
const data2 = "./public/graphs/AAPLPE.json" 
const data3 = "./public/graphs/AAPLPS.json" 
const fs = require('fs');

//read AAPLprice, AAPLPE & AAPLPS data from 3 json files asynchronousesly
  const readAAPLdata = async () => {
    try {
      const [priceData, peData, psData] = await Promise.all(
        [
          readFileAsync('./public/graphs/AAPLprice.json', 'utf8'),
          readFileAsync('./public/graphs/AAPLPE.json', 'utf8'),
          readFileAsync('./public/graphs/AAPLPS.json', 'utf8'),
        ]
      );
        const priceJsonData = JSON.parse(priceData);
        const peJsonData = JSON.parse(peData);
        const psJsonData = JSON.parse(psData);
        return { priceJsonData, peJsonData, psJsonData }
        //peJsonData, psJsonData
        //console.log(priceJsonData),
        //console.log(peJsonData), 
        //console.log(psJsonData)
    } catch (err) {
        console.error(`Error reading data JSON files: ${err}`); 
        throw err;
    }
  };  

//helper function to read files asynchronously
const readFileAsync = (path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
};
//call the async function to read files and render the view
readAAPLdata();

module.exports = {
    readAAPLdata
}