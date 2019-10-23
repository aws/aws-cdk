// tslint:disable:no-console
import SDK = require('aws-sdk');
import { IsCompleteHandler, LifecycleEvent, OnEventHandler } from './api';
import { cfnRespond } from './cfn-response';
import consts = require('./consts');
import { failOnError, getEnv, requireUserHandler, Retry } from './util';

export = {
  [consts.ON_EVENT_ENTRYPOINT]: onEventHandler,
  [consts.TIMEOUT_ENTRYPOINT]: timeoutHandler,
  [consts.IS_COMPLETE_ENTRYPOINT]: isCompleteHandler
};

const sfn = new SDK.StepFunctions();

async function onEventHandler(event: LifecycleEvent) {
  console.log(JSON.stringify(event));

  await failOnError(event, async () => {
    const userHandler: OnEventHandler = requireUserHandler(consts.ENV_ON_EVENT_USER_HANDLER);
    const result = await userHandler(event);

    if (event.PhysicalResourceId && result.PhysicalResourceId !== event.PhysicalResourceId) {
      throw new Error(`Physical resource ID cannot be changed from ${event.PhysicalResourceId} to ${result.PhysicalResourceId}`);
    }

    // merge event and result (result prevails)
    const input: LifecycleEvent = {
      ...event,
      ...result
    };

    const stateMachineArn = getEnv(consts.ENV_WAITER_STATE_MACHINE_ARN);
    if (!stateMachineArn) {
      throw new Error(`The environment variable ${consts.ENV_WAITER_STATE_MACHINE_ARN} is not defined`);
    }

    const req: AWS.StepFunctions.StartExecutionInput = {
      stateMachineArn,
      name: event.RequestId,
      input: JSON.stringify(input),
    };

    return await sfn.startExecution(req).promise();
  });
}

// invoked a few times until `complete` is true or until it times out.
async function isCompleteHandler(event: LifecycleEvent) {
  console.log({ complete: event });

  return await failOnError(event, async () => {
    const userHandler: IsCompleteHandler = requireUserHandler(consts.ENV_IS_COMPLETE_USER_HANDLER);
    const result = await userHandler(event);
    if (!result) {
      throw new Retry(JSON.stringify(event));
    }

    // done, respond with success
    await cfnRespond(event, 'SUCCESS', 'Done');
  });
}

// invoked when completion retries are exhaused.
async function timeoutHandler(event: any) {
  console.log(JSON.stringify(event));
  const e: LifecycleEvent = JSON.parse(JSON.parse(event.Cause).errorMessage);
  await cfnRespond(e, 'FAILED', 'Operation timed out');
}

// ---------------
