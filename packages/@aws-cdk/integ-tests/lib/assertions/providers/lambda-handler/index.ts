/* eslint-disable no-console */
import { AssertionHandler } from './assertion';
import { AwsApiCallHandler } from './sdk';
import * as types from './types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
  const provider = createResourceHandler(event, context);
  try {
    if (event.RequestType === 'Delete') {
      await provider.respond({
        status: 'SUCCESS',
        reason: 'OK',
      });
      return;
    }
    const result = await provider.handle();
    const actualPath = event.ResourceProperties.actualPath;
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
