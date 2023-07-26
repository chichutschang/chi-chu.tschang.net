const { google } = require('googleapis');
const serviceAccountKeyFile = "./prismatic-vial-760-6f928a53c9be.json";
const sheetId = '1YMncpMnEbMqZd6dp2j4Bcjw2BGqU3vzl90CPKS-QIOA'
const tab1 = 'AAPLprice Public'
const tab2 = 'AAPLforwardPE Public' 
const tab3 = 'AAPLforwardPS Public'
const range1 = 'A:B'
const range2 = 'A:G'
const data1 = "./public/graphs/AAPLprice.json"
const data2 = "./public/graphs/AAPLPE.json" 
const data3 = "./public/graphs/AAPLPS.json" 
const fs = require('fs');

// Invoke all 3 functions to read data from both tabs and write them to their respective JSON files
Promise.all([AAPLprice(), AAPLPE(), AAPLPS()]).then(() => {
  console.log('Data retrieved from Google Sheets and written to JSON files.');
}).catch(error => {
  console.error('Error:', error);
});

async function AAPLprice() {
  const googleSheetClient = await getGoogleSheetClient();
  const data = await readGoogleSheet(googleSheetClient, sheetId, tab1, range1);
}

async function AAPLPE() {
  const googleSheetClient = await getGoogleSheetClient();
  const data = await readGoogleSheet(googleSheetClient, sheetId, tab2, range2);
}

async function AAPLPS() {
    const googleSheetClient = await getGoogleSheetClient();
    const data = await readGoogleSheet(googleSheetClient, sheetId, tab3, range2);
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

async function readGoogleSheet(googleSheetClient, sheetId, tab, range) {
    try {
      const res = await googleSheetClient.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${tab}!${range}`,
      });
      const jsonData = JSON.stringify(res.data.values);
      
      if (tab === tab1) {
        fs.writeFile(data1, jsonData, err => {
          if (err) throw err;
        });
        console.log('Transferred data from Google Sheets to AAPLprice.json file');
      } else if (tab === tab2) {
        fs.writeFile(data2, jsonData, err => {
          if (err) throw err;
        });
        console.log('Transferred data from Google Sheets to AAPLpe.json file');
      }
      else if (tab === tab3) {
        fs.writeFile(data3, jsonData, err => {
          if (err) throw err;
        });
        console.log('Transferred data from Google Sheets to AAPLps.json file');
      }
    } catch(err) {
      console.error(`Error reading data from Google Sheets: ${err}`);
    }
  }
  readGoogleSheet()

  module.exports = {
    AAPLprice,
    AAPLPE,
    AAPLPS
  }

