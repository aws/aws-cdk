/* eslint-disable no-console */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';

export type InvokeFunction = (functionName: string) => Promise<AWS.Lambda.InvocationResponse>;

export const invoke: InvokeFunction = async (functionName) => {
  const lambda = new AWS.Lambda();
  const invokeRequest = { FunctionName: functionName };
  console.log({ invokeRequest });

  // IAM policy changes can take some time to fully propagate
  // Therefore, retry for up to one minute

  let retryCount = 0;
  const delay = 5000;

  let invokeResponse;
  while (true) {
    try {
      invokeResponse = await lambda.invoke(invokeRequest).promise();
      break;
    } catch (error) {
      if (error instanceof Error && (error as AWS.AWSError).code === 'AccessDeniedException' && retryCount < 12) {
        retryCount++;
        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
        continue;
      }

      throw error;
    }
  }

  console.log({ invokeResponse });
  return invokeResponse;
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  console.log({ ...event, ResponseURL: '...' });

  if (event.RequestType === 'Delete') {
    console.log('not calling trigger on DELETE');
    return;
  }

  const handlerArn = event.ResourceProperties.HandlerArn;
  if (!handlerArn) {
    throw new Error('The "HandlerArn" property is required');
  }

  const invokeResponse = await invoke(handlerArn);

  if (invokeResponse.StatusCode !== 200) {
    throw new Error(`Trigger handler failed with status code ${invokeResponse.StatusCode}`);
  }

  // if the lambda function throws an error, parse the error message and fail
  if (invokeResponse.FunctionError) {
    throw new Error(parseError(invokeResponse.Payload?.toString()));
  }
}

/**
 * Parse the error message from the lambda function.
 */
function parseError(payload: string | undefined): string {
  console.log(`Error payload: ${payload}`);
  if (!payload) { return 'unknown handler error'; }
  try {
    const error = JSON.parse(payload);
    const concat = [error.errorMessage, error.trace].filter(x => x).join('\n');
    return concat.length > 0 ? concat : payload;
  } catch {
    // fall back to just returning the payload
    return payload;
  }
}
