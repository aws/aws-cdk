/* eslint-disable no-console */

/* eslint-disable import/no-extraneous-dependencies */
import { AccessDeniedException } from '@aws-sdk/client-account';
import { Lambda, InvocationResponse } from '@aws-sdk/client-lambda';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';

export type InvokeFunction = (functionName: string, invocationType: string, timeout: number) => Promise<InvocationResponse>;

export const invoke: InvokeFunction = async (functionName, invocationType, timeout) => {
  const lambda = new Lambda({
    requestHandler: new NodeHttpHandler({
      socketTimeout: timeout,
    }),
  });

  const invokeRequest = { FunctionName: functionName, InvocationType: invocationType };
  console.log({ invokeRequest });

  // IAM policy changes can take some time to fully propagate
  // Therefore, retry for up to one minute

  let retryCount = 0;
  const delay = 5000;

  let invokeResponse;
  while (true) {
    try {
      invokeResponse = await lambda.invoke(invokeRequest);
      break;
    } catch (error) {
      if (error instanceof AccessDeniedException && retryCount < 12) {
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

  if (event.RequestType === 'Update' && event.ResourceProperties.ExecuteOnHandlerChange === 'false') {
    console.log('not calling trigger because ExecuteOnHandlerChange is false');
    return;
  }

  const handlerArn = event.ResourceProperties.HandlerArn;
  if (!handlerArn) {
    throw new Error('The "HandlerArn" property is required');
  }

  const invocationType = event.ResourceProperties.InvocationType;
  const timeout = event.ResourceProperties.Timeout;

  const parsedTimeout = parseInt(timeout);
  if (isNaN(parsedTimeout)) {
    throw new Error(`The "Timeout" property with value ${timeout} is not parseable to a number`);
  }

  const invokeResponse = await invoke(handlerArn, invocationType, parsedTimeout);

  if (invokeResponse.StatusCode && invokeResponse.StatusCode >= 400) {
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
  if (!payload) {
    return 'unknown handler error';
  }
  try {
    const error = JSON.parse(payload);
    const concat = [error.errorMessage, error.trace].filter(x => x).join('\n');
    return concat.length > 0 ? concat : payload;
  } catch {
    // fall back to just returning the payload
    return payload;
  }
}
