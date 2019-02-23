const AWS = require('aws-sdk');

exports.handler = async function(event, context) {
  try {
    console.log(JSON.stringify(event));

    if (event.ResourceProperties[event.RequestType]) {
      const { service, action, parameters } = event.ResourceProperties[event.RequestType];
      const awsService = new AWS[service]();
      await awsService[action](parameters).promise();
    }

    await respond('SUCCESS', 'OK');
  } catch (e) {
    console.log(e);
    await respond('FAILED', e.message);
  }

  function respond(responseStatus, reason) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: {}
    });

    console.log('Responding', JSON.stringify(responseBody));

    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: { 'content-type': '', 'content-length': responseBody.length }
    };

    return new Promise((resolve, reject) => {
      try {
        const request = require('https').request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
