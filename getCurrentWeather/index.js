var https = require('https')
var aws = require('aws-sdk')
var s3 = new aws.S3
var sns = new aws.SNS()

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}

async function getCurrentWeatherData(event) {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'api.weather.com',
            path: '/v2/pws/observations/current?apiKey=' + process.env.API_KEY + '&units=e&stationId=' + event.stationId + '&format=json',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let body = ''
            res.on('data', function (chunk) {
                body += chunk;
                let json = JSON.parse(body);
                console.log(json.observations[0].imperial);
                resolve(json);
            });
        });

        req.on('error', (e) => {
            reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
}

async function writeCurrentWeatherData(event, jsonBody) {
    let currentLocalDate = formatDate(jsonBody.observations[0].obsTimeLocal)
    
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: event.stationId + '/' + currentLocalDate + '/current.json',
        Body: JSON.stringify(jsonBody),
        ContentType: "application/json"
    };
    
    try {
        const res = await s3.upload(params).promise();
        // console.log('complete:', res);
        
        if (event.reportBack) {
            let messageString = `You've received ${jsonBody.observations[0].imperial.precipTotal}" of rain so far today.`
            
            var messageParams = {
              Message: messageString, /* required */
              PhoneNumber: '18167192137',
              Subject: 'Water Totals Today'
            }
            
            // Create promise and SNS service object
            var publishTextPromise = sns.publish(messageParams).promise()
        
            // Handle promise's fulfilled/rejected states
            await publishTextPromise.then(
              function(data) {
                console.log("Message ${messageParams.Subject} send sent to ${messageParams.PhoneNumber}")
                console.log("MessageID is " + data.MessageId)
              }).catch(
                function(err) {
                console.error(err, err.stack)
              })
        }
    } catch(err) {
        console.log('error:', err);
    }
}

exports.handler = async (event) => {
    let jsonBody =  await getCurrentWeatherData(event);
    await writeCurrentWeatherData(event, jsonBody);
    return jsonBody
};
