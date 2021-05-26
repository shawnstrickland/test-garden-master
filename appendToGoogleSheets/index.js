const { getS3ObjectAsJSON } = require('./aws')
const { authorize, createSheetsResource, getSheetNames, appendToSheet } = require('./google');
const { returnMonth } = require('./prettyDate');

async function main(event) {
  let precipitationTotal;

  try {
    // Get s3 data written to bucket (which this function is triggered by)
    // pull of precipitation rate, or anything else interesting we'll want to write to Google Sheets
    const s3Event = event.Records[0].s3;
    const bodyAsJSON = await getS3ObjectAsJSON({ Bucket: s3Event.bucket.name, Key: s3Event.object.key });
    precipitationTotal = bodyAsJSON.observations[0].imperial.precipTotal;

    // TODO: if Sheet doesn't already exist, add it, then append to new sheet
    const s3ObjectKeyParts = s3Event.object.key.split('/');
    const targetMonth = returnMonth(+s3ObjectKeyParts[2]);
    const authClient = await authorize();
    const sheetNames = await getSheetNames(authClient);
    if (sheetNames.includes(`${targetMonth} - ${s3ObjectKeyParts[1]}`)) {
      const resource = createSheetsResource(`${s3ObjectKeyParts[2]}/${s3ObjectKeyParts[3]}/${s3ObjectKeyParts[1]}`, precipitationTotal);
      // Write to sheet with month and year
      return appendToSheet(`${targetMonth} - ${s3ObjectKeyParts[1]}!A1`, 'RAW', resource, authClient);
    } else {
      // create sheet, then append to it
      await createSheet(`${targetMonth} - ${s3ObjectKeyParts[1]}`, authClient)
      // Write to sheet with month and year
      return appendToSheet(`${targetMonth} - ${s3ObjectKeyParts[1]}!A1`, 'RAW', resource, authClient);
    }
  } catch (err) {
    console.log(err);
  }
}

exports.handler = async (event) => {
  return main(event);
};
