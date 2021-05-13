var aws = require('aws-sdk')
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const s3 = new aws.S3();

async function main (event) {
  // Get S3 object written
  try {
    const s3Event = event.Records[0].s3
  
    var params = {
      Bucket: s3Event.bucket.name, 
      Key: s3Event.object.key + '/current.json'
    }
    
    console.log(params.Bucket, params.Key)

    const file = await s3
      .getObject(params)
      .promise()
      
    const bodyAsJSON = JSON.parse(file.Body.toString('utf-8'))
    const precipitationTotal = bodyAsJSON.observations[0].imperial.precipTotal
    return precipitationTotal
  } catch (err) {
    console.log(err);
  }

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
          // addSheet: {
          //     properties: {
          //         title: 'Yet Another Cool Test Create SheetFrom API And Again'
          //     }
          // }
          appendCells: {
            sheetId: 1,
            rows: [
              {
                values: ['a test']
              }
            ]
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

  // Update spreadsheet
  try {
    const authClient = await authorize();
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

async function authorize() {
  return new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, process.env.GOOGLE_SHEETS_PRIVATE_KEY, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
}

exports.handler = async (event) => {
  let jsonBody = await main(event)
  return jsonBody
};