/* istanbul ignore file */
import AWS = require('aws-sdk');
import https = require('https');

export async function defaultHttpRequest(options: https.RequestOptions, responseBody: string) {
  return new Promise((resolve, reject) => {
    try {
      const request = https.request(options, resolve);
      request.on('error', reject);
      request.write(responseBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}

let sfn: AWS.StepFunctions;

export async function defaultStartExecution(req: AWS.StepFunctions.StartExecutionInput): Promise<AWS.StepFunctions.StartExecutionOutput> {
  if (!sfn) {
    sfn = new AWS.StepFunctions();
  }

  return await sfn.startExecution(req).promise();
}
