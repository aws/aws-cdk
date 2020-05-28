// tslint:disable no-console
import { StepFunctions } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { respond } from './http';

export const CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::StateMachineProvider::CREATE_FAILED';

interface Output {
  PhysicalResourceId?: string;
  Data?: { [Key: string]: any; };
  NoEcho?: boolean;
}

interface ExecutionResult {
  ExecutionArn: string;
  Input: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string };
  Name: string;
  Output?: Output;
  StartDate: number;
  StateMachineArn: string;
  Status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED';
  StopDate: number;
}

interface FailedExecutionEvent {
  Error: string;
  Cause: string;
}

export async function cfnResponseSuccess(event: ExecutionResult) {
  console.log('Event: %j', event);
  await respond('SUCCESS', {
    ...event.Input,
    PhysicalResourceId: event.Output?.PhysicalResourceId ?? event.Input.PhysicalResourceId ?? event.Input.RequestId,
    Data: event.Output?.Data ?? {},
    NoEcho: event.Output?.NoEcho,
  });
}

export async function cfnResponseFailed(event: FailedExecutionEvent) {
  console.log('Event: %j', event);

  const parsedCause = JSON.parse(event.Cause);
  const executionResult: ExecutionResult = {
    ...parsedCause,
    Input: JSON.parse(parsedCause.Input),
  };
  console.log('Execution result: %j', executionResult);

  let physicalResourceId = executionResult.Output?.PhysicalResourceId ?? executionResult.Input.PhysicalResourceId;
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

export async function startExecution(event: AWSLambda.CloudFormationCustomResourceEvent) {
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
