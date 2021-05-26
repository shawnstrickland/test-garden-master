const { google } = require('googleapis');
const sheets = google.sheets('v4');

async function authorize() {
  return new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, process.env.GOOGLE_SHEETS_PRIVATE_KEY.trim(), [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
}

function createSheetsResource(date, precipitationTotal) {
  // TODO: Adjust date to time zone and beautify
  const values = [[date, precipitationTotal, new Date()]];

  let resource = {
    values,
  };

  return resource;
}

async function getSheetNames(authClient) {
  const sheet = (await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    auth: authClient
  })).data.sheets.map(sheet => {
    return sheet.properties.title
  })

  console.log(sheet)
}

async function appendToSheet(range, valueInputOption, resource, authClient) {
  const response = (await sheets.spreadsheets.values.append(
    {
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range,
      valueInputOption,
      resource,
      auth: authClient
    }
  )).data;

  // TODO: Change code below to process the `response` object:
  console.log(JSON.stringify(response, null, 2));
  return response;
}

module.exports = {
  authorize,
  createSheetsResource,
  getSheetNames,
  appendToSheet
}
