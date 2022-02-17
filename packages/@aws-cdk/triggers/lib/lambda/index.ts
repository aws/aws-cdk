/* eslint-disable no-console */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';

exports.handler = async function(event: AWSLambda.CloudFormationCustomResourceEvent) {
  console.log({ event });

  if (event.RequestType === 'Delete') {
    console.log('not calling trigger on DELETE');
    return;
  }

  const handlerArn = event.ResourceProperties.HandlerArn;
  if (!handlerArn) {
    throw new Error('The "HandlerArn" property is required');
  }

  const lambda = new AWS.Lambda();
  const invokeRequest = { FunctionName: handlerArn };
  console.log({ invokeRequest });
  const invokeResponse = await lambda.invoke(invokeRequest).promise();
  console.log({ invokeResponse });

  if (invokeResponse.StatusCode !== 200) {
    throw new Error(`Invoke failed with status code ${invokeResponse.StatusCode}`);
  }

  // if the lambda function throws an error, parse the error message and fail
  if (invokeResponse.FunctionError) {
    throw new Error(parseError(invokeResponse.Payload?.toString()));
  }
};

/**
 * Parse the error message from the lambda function.
 */
function parseError(payload: string | undefined): string {
  if (!payload) { return 'unknown handler error'; }
  try {
    const error = JSON.parse(payload);
    const concat = [error.errorMessage, error.trace].filter(x => x).join('\n');
    return concat.length > 0 ? concat : payload;
  } catch (e) {
    // fall back to just returning the payload
    return payload;
  }
}
