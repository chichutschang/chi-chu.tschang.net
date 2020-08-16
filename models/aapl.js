const {google} = require('googleapis');
const keys = require('./prismatic-vial-760-b4c08141e236.json')
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);
const APIkey = 'AIzaSyDD6De6j2vBXZvk3Z63oozV89m6qqVocm4';

//connect to Google Spreadsheets with client
client.authorize(function(err, tokens){
    if(err){
        console.log(err);
        return;
    } else {
        console.log('Connected to Google Spreadsheet...');
        price(client);
    }
});

//access data in Apple Google Spreadsheets
async function price(){
    try {
    //set Google Spreadsheets version & auth
    const googlesheetsapi =  google.sheets({version: 'v4', auth: APIkey });
    //set values for Google Spreadsheets' spreadsheetId, tab & range
    const option = {
        spreadsheetId: '1YMncpMnEbMqZd6dp2j4Bcjw2BGqU3vzl90CPKS-QIOA',
        range: 'AAPLprice Public!A1:B11000'
    }
    let data = await googlesheetsapi.spreadsheets.values.get(option);
    //console.log(data);
    console.log(data.data.values);
    return data.data.values
    } catch (err) {
        console.error(err);
    }
    //return data.data.values
}


module.exports = {
    price
}