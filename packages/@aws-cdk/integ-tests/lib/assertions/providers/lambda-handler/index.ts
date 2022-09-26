/* eslint-disable no-console */
import { AssertionHandler } from './assertion';
import { AwsApiCallHandler } from './sdk';
import * as types from './types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
  const provider = createResourceHandler(event, context);
  try {
    // if we are deleting the custom resource, just respond
    // with 'SUCCESS' since there is nothing to do.
    if (event.RequestType === 'Delete') {
      await provider.respond({
        status: 'SUCCESS',
        reason: 'OK',
      });
      return;
    }
    const result = await provider.handle();
    const actualPath = event.ResourceProperties.actualPath;
    // if we are providing a path to make the assertion at, that means that we have
    // flattened the response, otherwise the path to assert against in the entire response
    const actual = actualPath ? (result as { [key: string]: string })[`apiCallResponse.${actualPath}`] : (result as types.AwsApiCallResult).apiCallResponse;
    if ('expected' in event.ResourceProperties) {
      const assertion = new AssertionHandler({
        ...event,
        ResourceProperties: {
          ServiceToken: event.ServiceToken,
          actual,
          expected: event.ResourceProperties.expected,
        },
      }, context);
      try {
        const assertionResult = await assertion.handle();
        await provider.respond({
          status: 'SUCCESS',
          reason: 'OK',
          // return both the result of the API call _and_ the assertion results
          data: {
            ...assertionResult,
            ...result,
          },
        });
        return;
      } catch (e) {
        await provider.respond({
          status: 'FAILED',
          reason: e.message ?? 'Internal Error',
        });
        return;
      }
    }
    await provider.respond({
      status: 'SUCCESS',
      reason: 'OK',
      data: result,
    });
  } catch (e) {
    await provider.respond({
      status: 'FAILED',
      reason: e.message ?? 'Internal Error',
    });
    return;
  }
  return;
}

function createResourceHandler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  if (event.ResourceType.startsWith(types.SDK_RESOURCE_TYPE_PREFIX)) {
    return new AwsApiCallHandler(event, context);
  } else if (event.ResourceType.startsWith(types.ASSERT_RESOURCE_TYPE)) {
    return new AssertionHandler(event, context);
  } else {
    throw new Error(`Unsupported resource type "${event.ResourceType}`);
  }
}
