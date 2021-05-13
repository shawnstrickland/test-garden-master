var aws = require('aws-sdk')
var s3 = new aws.S3();
var sns = new aws.SNS();
var fileReferenceList = []
var fileReferenceListPrecipitationRate = []
var precipTotal = 0

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}

function LastXDays (numberOfDaysToGoBack) {
    var result = [];
    for (var i=0; i<=numberOfDaysToGoBack; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push( formatDate(d) )
    }

    return(result.join(','));
}

async function lookUpS3Object(bucket, stationId, key, fileName) {
    const params = {
        Bucket: bucket,
        Key: stationId + key + fileName
    }
    try {
        await s3.headObject(params).promise()
        fileReferenceList.push(key)
    } catch (err) {
        console.error(err)
    }    
}

async function getS3Object(bucket, stationId, key, fileName) {
    const params = {
        Bucket: bucket,
        Key: stationId + key + fileName
    };
    
    try {
        const response = await s3.getObject(params).promise()
        return response.Body.toString()
    } catch (err) {
        console.error(err)
    }
}

exports.handler = async (event) => {
    console.log("running sendPrecipitationReport")
    
    /* Grab the last X days */
    let daysArray = LastXDays(process.env.DAYS).split(',');
    console.log(daysArray);
    for (const day of daysArray) {
        /* See if any of these days exist in S3 */
        const contents = await lookUpS3Object(process.env.BUCKET_NAME, event.stationId + '/', day, '/current.json');
    }
    
    /* Of the items we looked for, only run .getObject on ones that exist */
    for (const file of fileReferenceList) {
        const contents = await getS3Object(process.env.BUCKET_NAME, event.stationId + '/', file, '/current.json');
        let body = JSON.parse(contents)
        fileReferenceListPrecipitationRate.push(body.observations[0].imperial.precipTotal)
        precipTotal += body.observations[0].imperial.precipTotal
    }
    
    let messageString = 'This is your watering reminder:\n\n'
    
    /* Filter out ugly math */
    precipTotal = +(precipTotal.toFixed(2))
    
    if (precipTotal < process.env.WATER_NEEDED) {
        let waterNeeded = process.env.WATER_NEEDED - precipTotal
        /* Some more precipitation is needed */
        messageString += 'Some more water (' + waterNeeded.toFixed(2) + '") is needed.\n\n'
    } else {
        /* No more precipitation needed */
        messageString += 'No extra watering is needed so far (You\'ve received ' + precipTotal + '\" over the last ' + process.env.DAYS + ' days).\n\n';
    }
    
    for (let i = 0 ; i < fileReferenceList.length; i++) {
        messageString += '(' + fileReferenceList[i] + ')' + ': ' + fileReferenceListPrecipitationRate[i] + '"\n'    
    }
    
    var params = {
      Message: messageString, /* required */
      PhoneNumber: process.env.PHONE_NUMBER,
      Subject: 'Watering Reminder'
    }

    if (process.env.SEND_MESSAGE === 'true') {
        // Create promise and SNS service object
        var publishTextPromise = sns.publish(params).promise()
        
        // Handle promise's fulfilled/rejected states
        await publishTextPromise.then(
          function(data) {
            console.log("Message ${params.Subject} send sent to ${params.PhoneNumber}")
            console.log("MessageID is " + data.MessageId)
          }).catch(
            function(err) {
            console.error(err, err.stack)
          })   
    } else {
        console.warn('SEND_MESSAGE disable so not sending precipitation report.')
    }
    
    return messageString
};
