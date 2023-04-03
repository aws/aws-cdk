/* istanbul ignore file */
import * as https from 'https';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ConfigurationOptions } from 'aws-sdk/lib/config-base';

const FRAMEWORK_HANDLER_TIMEOUT = 900000; // 15 minutes

// In order to honor the overall maximum timeout set for the target process,
// the default 2 minutes from AWS SDK has to be overriden:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#httpOptions-property
const awsSdkConfig: ConfigurationOptions = {
  httpOptions: { timeout: FRAMEWORK_HANDLER_TIMEOUT },
};

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
    sfn = new AWS.StepFunctions(awsSdkConfig);
  }

  return sfn.startExecution(req).promise();
}

async function defaultInvokeFunction(req: AWS.Lambda.InvocationRequest): Promise<AWS.Lambda.InvocationResponse> {
  if (!lambda) {
    lambda = new AWS.Lambda(awsSdkConfig);
  }

  try {
    /**
     * Try an initial invoke.
     *
     * When you try to invoke a function that is inactive, the invocation fails and Lambda sets
     * the function to pending state until the function resources are recreated.
     * If Lambda fails to recreate the resources, the function is set to the inactive state.
     *
     * We're using invoke first because `waitFor` doesn't trigger an inactive function to do anything,
     * it just runs `getFunction` and checks the state.
     */
    return await lambda.invoke(req).promise();
  } catch {

    /**
     * The status of the Lambda function is checked every second for up to 300 seconds.
     * Exits the loop on 'Active' state and throws an error on 'Inactive' or 'Failed'.
     *
     * And now we wait.
     */
    await lambda.waitFor('functionActiveV2', {
      FunctionName: req.FunctionName,
    }).promise();
    return await lambda.invoke(req).promise();
  }
}

export let startExecution = defaultStartExecution;
export let invokeFunction = defaultInvokeFunction;
export let httpRequest = defaultHttpRequest;
