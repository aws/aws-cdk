// tslint:disable:no-console
import SDK = require('aws-sdk');
import { CompleteResourceEvent, ResourceEvent } from './api';
import { MyResourceHandler } from './demo';

const sfn = new SDK.StepFunctions();
const asyncHandler = new MyResourceHandler();

async function failOnError(event: ResourceEvent, block: () => Promise<any>) {
  try {
    return await block();
  } catch (e) {
    if (e instanceof Retry) {
      throw e; // state machine will retry
    }

    // this is an actual error, fail the activity altogether and exist.
    await respond(event, 'FAILED', e.message);

    return {
      error: e.message
    };
  }
}

exports.begin = async (event: ResourceEvent) => {
  console.log(JSON.stringify(event));

  await failOnError(event, async () => {
    const result = asyncHandler.begin(event);

    if (event.PhysicalResourceId && result.PhysicalResourceId !== event.PhysicalResourceId) {
      throw new Error(`Physical resource ID cannot be changed from ${event.PhysicalResourceId} to ${result.PhysicalResourceId}`);
    }

    const input: CompleteResourceEvent = {
      ...event,
      PhysicalResourceId: result.PhysicalResourceId,
      Data: result.Data,
    };

    const stateMachineArn = process.env.STATE_MACHINE_ARN;
    if (!stateMachineArn) {
      throw new Error(`STATE_MACHINE_ARN is not defined`);
    }

    const req: AWS.StepFunctions.StartExecutionInput = {
      stateMachineArn,
      name: event.RequestId,
      input: JSON.stringify(input),
    };

    return await sfn.startExecution(req).promise();
  });
};

// invoked a few times until `complete` is true or until it times out.
exports.complete = async (event: CompleteResourceEvent) => {
  console.log({ complete: event });

  return await failOnError(event, async () => {

    const result = asyncHandler.complete(event);
    if (!result.complete) {
      throw new Retry(JSON.stringify(event));
    }

    // done, respond with success
    await respond(event, 'SUCCESS', 'Done');
  });
};

// invoked when completion retries are exhaused.
exports.timeout = async (event: any) => {
  console.log(JSON.stringify(event));
  const e: ResourceEvent = JSON.parse(JSON.parse(event.Cause).errorMessage);
  await respond(e, 'FAILED', 'Operation timed out');
};

class Retry extends Error { }

function respond(event: ResourceEvent, responseStatus: 'SUCCESS' | 'FAILED', reason: string) {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: reason,
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: event.PhysicalResourceId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: event.Data
  });

  console.log('Responding', responseBody);

  const parsedUrl = require('url').parse(event.ResponseURL);
  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: { 'content-type': '', 'content-length': responseBody.length }
  };

  return new Promise((resolve, reject) => {
    try {
      const request = require('https').request(requestOptions, resolve);
      request.on('error', reject);
      request.write(responseBody);
      request.end();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
