// tslint:disable no-console
import { StepFunctions } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import * as https from 'https';
import * as url from 'url';

const CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::StateMachineProvider::CREATE_FAILED';
const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::StateMachineProvider::MISSING_PHYSICAL_ID';

interface ExecutionResult {
  ExecutionArn: string;
  Input: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string };
  Name: string;
  Output?: AWSLambda.CloudFormationCustomResourceResponse;
  StartDate: number;
  StateMachineArn: string;
  Status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED';
  StopDate: number;
}

interface FailedExecutionEvent {
  Error: string;
  Cause: string;
}

interface CloudFormationResponse {
  StackId: string;
  RequestId: string;
  PhysicalResourceId?: string;
  LogicalResourceId: string;
  ResponseURL: string;
  Data?: any;
  NoEcho?: boolean;
  Reason?: string;
}

export async function cfnResponseSuccess(event: ExecutionResult, _context: AWSLambda.Context) {
  console.log('Event: %j', event);
  await respond('SUCCESS', {
    ...event.Input,
    PhysicalResourceId: event.Output?.PhysicalResourceId ?? event.Input.PhysicalResourceId ?? event.Input.RequestId,
    Data: event.Output?.Data ?? {},
    NoEcho: event.Output?.NoEcho,
  });
}

export async function cfnResponseFailed(event: FailedExecutionEvent, _context: AWSLambda.Context) {
  console.log('Event: %j', event);

  const parsedCause = JSON.parse(event.Cause);
  const executionResult: ExecutionResult = {
    ...parsedCause,
    Input: JSON.parse(parsedCause.Input),
  };
  console.log('Execution result: %j', executionResult);

  let physicalResourceId = executionResult.Output?.PhysicalResourceId;
  if (!physicalResourceId) {
    // special case: if CREATE fails, which usually implies, we usually don't
    // have a physical resource id. in this case, the subsequent DELETE
    // operation does not have any meaning, and will likely fail as well. to
    // address this, we use a marker so the provider framework can simply
    // ignore the subsequent DELETE.
    if (executionResult.Input.RequestType === 'Create') {
      console.log('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
      physicalResourceId = CREATE_FAILED_PHYSICAL_ID_MARKER;
    } else {
      console.log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event)}`);
    }
  }

  await respond('FAILED', {
    ...executionResult.Input,
    Reason: `${event.Error}: ${event.Cause}`,
    PhysicalResourceId: physicalResourceId,
  });
}

export async function startExecution(event: AWSLambda.CloudFormationCustomResourceEvent, _context: AWSLambda.Context) {
  try {
    console.log('Event: %j', event);

    if (!process.env.STATE_MACHINE_ARN) {
      throw new Error('Missing STATE_MACHINE_ARN.');
    }

    // ignore DELETE event when the physical resource ID is the marker that
    // indicates that this DELETE is a subsequent DELETE to a failed CREATE
    // operation.
    if (event.RequestType === 'Delete' && event.PhysicalResourceId === CREATE_FAILED_PHYSICAL_ID_MARKER) {
      console.log('ignoring DELETE event caused by a failed CREATE event');
      await respond('SUCCESS', event);
      return;
    }

    const stepFunctions = new StepFunctions();
    await stepFunctions.startExecution({
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: JSON.stringify(event),
    }).promise();
  } catch (err) {
    console.log(err);
    await respond('FAILED', {
      ...event,
      Reason: err.message,
    });
  }
}

function respond(status: 'SUCCESS' | 'FAILED', event: CloudFormationResponse) {
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: event.Reason ?? status,
    PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: event.NoEcho ?? false,
    Data: event.Data,
  };

  console.log('Responding: %j', json);

  const responseBody = JSON.stringify(json);

  const parsedUrl = url.parse(event.ResponseURL);
  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: { 'content-type': '', 'content-length': responseBody.length },
  };

  return new Promise((resolve, reject) => {
    try {
      const request = https.request(requestOptions, resolve);
      request.on('error', reject);
      request.write(responseBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}
