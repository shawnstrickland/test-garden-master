var aws = require('aws-sdk');
const s3 = new aws.S3();

async function getS3ObjectAsJSON(params) {
    const file = await s3
        .getObject(params)
        .promise();

    return JSON.parse(file.Body.toString('utf-8'));
}

module.exports = {
    getS3ObjectAsJSON
}
