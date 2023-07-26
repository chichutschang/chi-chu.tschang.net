const { google } = require('googleapis');
const serviceAccountKeyFile = "./prismatic-vial-760-6f928a53c9be.json";
const sheetId = '1YMncpMnEbMqZd6dp2j4Bcjw2BGqU3vzl90CPKS-QIOA'
const tabName = 'AAPLprice Public'
const range = 'A:B'
const data = "./public/graphs/AAPLprice.json"
const fs = require('fs');

AAPLprice().then(() => {
    console.log('Retrieved AAPL stock price data from /routes/aapl.js')
  })
  
  async function AAPLprice() {
    // Generating google sheet client
    const googleSheetClient = await getGoogleSheetClient();
  
    // Reading Google Sheet from a specific range
    const data = await readGoogleSheet(googleSheetClient, sheetId, tabName, range);
    //console.log(data);
  }

async function getGoogleSheetClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    return google.sheets({
      version: 'v4',
      auth: authClient,
    });
  }
getGoogleSheetClient()

  async function readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
    try {
      const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tabName}!${range}`,
      });
      //return res.data.values;
      fs.writeFile(data, JSON.stringify(res.data.values), err => {
        if (err) throw err;
      });
      console.log('Transferred data from Google Sheets to AAPLprice.json file') 
    } catch(err) {
      console.error(`Error reading data from Google Sheets: ${err}`);
    }
  }
readGoogleSheet()

  module.exports = {
    AAPLprice
  }
