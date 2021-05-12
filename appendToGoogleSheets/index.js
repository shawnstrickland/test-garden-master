const fs = require('fs');
const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function main () {
  const authClient = await authorize();

    let requests = [];
    // Change the spreadsheet's title.
    requests.push(
        {
            // updateSpreadsheetProperties: {
            //     properties: {
            //         title: 'Test New',
            //     },
            //     fields: 'title'
            // }
            addSheet: {
                properties: {
                    title: 'Yet Another Cool Test Create SheetFrom API And Again'
                }
            }
        }
    );
    // Find and replace text.
    // requests.push({
    // findReplace: {
    //     find,
    //     replacement,
    //     allSheets: true,
    // },
    // });

  try {
    const batchUpdateRequest = {requests};
    const response = (await sheets.spreadsheets.batchUpdate(
        {
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            resource: batchUpdateRequest,
            auth: authClient
        }
    )).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();

async function authorize() {
  return new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, process.env.GOOGLE_SHEETS_PRIVATE_KEY, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
}
