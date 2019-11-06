/* istanbul ignore file */
import AWS = require('aws-sdk');
import https = require('https');

async function defaultHttpRequest(options: https.RequestOptions, responseBody: string) {
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
let lambda: AWS.Lambda;

async function defaultStartExecution(req: AWS.StepFunctions.StartExecutionInput): Promise<AWS.StepFunctions.StartExecutionOutput> {
  if (!sfn) {
    sfn = new AWS.StepFunctions();
  }

  return await sfn.startExecution(req).promise();
}

async function defaultInvokeFunction(req: AWS.Lambda.InvocationRequest): Promise<AWS.Lambda.InvocationResponse> {
  if (!lambda) {
    lambda = new AWS.Lambda();
  }

  return await lambda.invoke(req).promise();
}

export let startExecution = defaultStartExecution;
export let invokeFunction = defaultInvokeFunction;
export let httpRequest = defaultHttpRequest;