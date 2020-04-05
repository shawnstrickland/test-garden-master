exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda and Github! And Shawn! And a final test from send Precip!'),
    };
    return response;
};
