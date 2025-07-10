/* istanbul ignore file */
import * as https from 'https';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Lambda, waitUntilFunctionActiveV2, InvocationResponse, InvokeCommandInput } from '@aws-sdk/client-lambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SFN, StartExecutionInput, StartExecutionOutput } from '@aws-sdk/client-sfn';
// eslint-disable-next-line import/no-extraneous-dependencies

const FRAMEWORK_HANDLER_TIMEOUT = 900000; // 15 minutes

// In order to honor the overall maximum timeout set for the target process,
// the default 2 minutes from AWS SDK has to be overriden:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#httpOptions-property
const awsSdkConfig = {
  httpOptions: { timeout: FRAMEWORK_HANDLER_TIMEOUT },
};

async function defaultHttpRequest(options: https.RequestOptions, requestBody: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const request = https.request(options, (response) => {
        response.resume(); // Consume the response but don't care about it
        if (!response.statusCode || response.statusCode >= 400) {
          reject(new Error(`Unsuccessful HTTP response: ${response.statusCode}`));
        } else {
          resolve();
        }
      });
      request.on('error', reject);
      request.write(requestBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}

let sfn: SFN;
let lambda: Lambda;

async function defaultStartExecution(req: StartExecutionInput): Promise<StartExecutionOutput> {
  if (!sfn) {
    sfn = new SFN(awsSdkConfig);
  }

  return sfn.startExecution(req);
}

async function defaultInvokeFunction(req: InvokeCommandInput): Promise<InvocationResponse> {
  if (!lambda) {
    lambda = new Lambda(awsSdkConfig);
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
    return await lambda.invoke(req);
  } catch {
    /**
     * The status of the Lambda function is checked every second for up to 300 seconds.
     * Exits the loop on 'Active' state and throws an error on 'Inactive' or 'Failed'.
     *
     * And now we wait.
     */
    await waitUntilFunctionActiveV2({
      client: lambda,
      maxWaitTime: 300,
    }, {
      FunctionName: req.FunctionName,
    });
    return lambda.invoke(req);
  }
}

export let startExecution = defaultStartExecution;
export let invokeFunction = defaultInvokeFunction;
export let httpRequest = defaultHttpRequest;
