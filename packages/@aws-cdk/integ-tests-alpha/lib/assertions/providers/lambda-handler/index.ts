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
    // if there is a `stateMachineArn` then we have already started a state machine
    // execution and the rest will be handled there
    if ('stateMachineArn' in event.ResourceProperties) {
      console.info('Found "stateMachineArn", waiter statemachine started');
      return;
    } else if ('expected' in event.ResourceProperties) {
      console.info('Found "expected", testing assertions');
      const actualPath = event.ResourceProperties.actualPath;
      // if we are providing a path to make the assertion at, that means that we have
      // flattened the response, otherwise the path to assert against in the entire response
      const actual = actualPath ? (result as { [key: string]: string })[`apiCallResponse.${actualPath}`] : (result as types.AwsApiCallResult).apiCallResponse;
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
      } catch (e: any) {
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
  } catch (e: any) {
    await provider.respond({
      status: 'FAILED',
      reason: e.message ?? 'Internal Error',
    });
    return;
  }
  return;
}

/**
 * Invoked by the waiter statemachine when the retry
 * attempts are exhausted
 */
export async function onTimeout(timeoutEvent: any) {
  // the event payload is passed through the `errorMessage` in the state machine
  // timeout event
  const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage);
  const provider = createResourceHandler(isCompleteRequest, standardContext);
  await provider.respond({
    status: 'FAILED',
    reason: 'Operation timed out: ' + JSON.stringify(isCompleteRequest),
  });
}

/**
 * Invoked by the waiter statemachine when the user is waiting for a specific
 * result.
 *
 * If the result of the assertion is not successful then it will throw an error
 * which will cause the state machine to try again
 */
export async function isComplete(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
  const provider = createResourceHandler(event, context);
  try {
    const result = await provider.handleIsComplete();
    const actualPath = event.ResourceProperties.actualPath;
    if (result) {
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
        const assertionResult = await assertion.handleIsComplete();
        if (!(assertionResult?.failed)) {
          await provider.respond({
            status: 'SUCCESS',
            reason: 'OK',
            data: {
              ...assertionResult,
              ...result,
            },
          });
          return;
        } else {
          console.log(`Assertion Failed: ${JSON.stringify(assertionResult)}`);
          throw new Error(JSON.stringify(event));
        }
      }
      await provider.respond({
        status: 'SUCCESS',
        reason: 'OK',
        data: result,
      });
    } else {
      console.log('No result');
      throw new Error(JSON.stringify(event));
    }
    return;
  } catch (e) {
    console.log(e);
    throw new Error(JSON.stringify(event));
  }
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

const standardContext: any = {
  getRemainingTimeInMillis: () => 90000,
};
