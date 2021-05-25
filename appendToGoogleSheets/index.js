const { getS3ObjectAsJSON } = require('./aws')
const { authorize, createSheetsResource, getSheetNames, appendToSheet } = require('./google');
const { returnMonth } = require('./prettyDate');

async function main(event) {
  let precipitationTotal;

  // Get S3 object written
  try {
    const s3Event = event.Records[0].s3;
    console.log(s3Event);

    // test
    var params = {
      Bucket: s3Event.bucket.name,
      Key: s3Event.object.key
    }

    const bodyAsJSON = await getS3ObjectAsJSON(params);
    precipitationTotal = bodyAsJSON.observations[0].imperial.precipTotal;

    // TODO: Write to sheet with month and year
    // if it doesn't already exist, add it, then append to new sheet
    const authClient = await authorize();
    await getSheetNames(authClient);

    const s3ObjectKeyParts = params.Key.split('/');
    const resource = createSheetsResource(`${s3ObjectKeyParts[2]}/${s3ObjectKeyParts[3]}/${s3ObjectKeyParts[1]}`, precipitationTotal);
    return appendToSheet(`${s3ObjectKeyParts[2]} - ${s3ObjectKeyParts[1]}!A1`, 'RAW', resource, authClient);
  } catch (err) {
    console.log(err);
  }
}

exports.handler = async (event) => {
  return main(event);
};
