var aws = require('aws-sdk')
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const s3 = new aws.S3();

async function main (event) {
  let precipitationTotal
  let date

  // Get S3 object written
  try {
    const s3Event = event.Records[0].s3
    console.log(s3Event)
  
    var params = {
      Bucket: s3Event.bucket.name, 
      Key: s3Event.object.key
    }
    
    let keyParts = params.Key.split('/')
    date = `${keyParts[2]}/${keyParts[3]}/${keyParts[1]}`

    const file = await s3
      .getObject(params)
      .promise()
      
    const bodyAsJSON = JSON.parse(file.Body.toString('utf-8'))
    precipitationTotal = bodyAsJSON.observations[0].imperial.precipTotal
    
    // TODO: Write to sheet with month and year
    // if it doesn't already exist, add it, then append to new sheet
    let range = `${keyParts[2]}!A1`; // using number of month for the time being
    let valueInputOption = "RAW";
    let myValue = precipitationTotal;
    
    let values = [[date, myValue, new Date()]];
    let resource = {
        values,
    };
    
    const authClient = await authorize();
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
    return response
  } catch (err) {
    console.log(err);
  }
}

async function authorize() {
  return new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, process.env.GOOGLE_SHEETS_PRIVATE_KEY.trim(), [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
}

exports.handler = async (event) => {
  let jsonBody = await main(event)
  return jsonBody
};