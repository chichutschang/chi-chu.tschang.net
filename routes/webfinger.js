const webfingerdata = "./public/graphs/webfinger.json" 
const fs = require('fs');

const webfinger = async () => {
    try {
        const webfinger = await fs.promises.readFile('./public/graphs/webfinger.json', 'utf8');
        //return webfinger;
        const webfingerData = JSON.parse(webfinger);
        //console.log('Webfinger data loaded:', webfingerData);
        return { webfingerData }
        //console.log(webfingerData)
    }  
    catch (err) {
        console.error(`Error reading webfinger JSON file: ${err}`); 
        throw err;
    }       
}

//call the async function to read files and render the view
webfinger().catch(err => console.error('Test failed:', err));

module.exports = {
    webfinger
}