// tslint:disable: no-console
// tslint:disable: max-line-length
import { submitCloudFormationResponse } from './cfn-response';
import consts = require('./consts');
import { defaultStartWaiterSfnExecution } from './outbound';
import { failOnError, getEnv, log, requireUserHandler, Retry } from './util';

export let startWaiterSfnExecution = defaultStartWaiterSfnExecution;

/**
 * The main runtime entrypoint of the async custom resource lambda function.
 *
 * Any lifecycle event changes to the custom resources will invoke this handler, which will, in turn,
 * interact with the user-defined `onEvent` and `isComplete` handlers.
 *
 * This function will always succeed. If an error occurs
 *
 * @param cfnRequest The cloudformation custom resource event.
 */
export async function onEventHandler(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent) {
  await failOnError(cfnRequest, async () => {
    log('onEventHandler', cfnRequest);

    validateCfnRequest(cfnRequest);

    const onEventResult = await executeOnEventUserHandler(cfnRequest);

    // at this point, we should know the physical ID, for CREATE, it should be in the result
    // of onEvent. In UPDATE/DELETE is should be in the input event itself.
    validatePhysicalResourceId(cfnRequest, onEventResult);

    // merge request event and result event (result prevails).
    const isCompleteEvent: AWSCDKAsyncCustomResource.IsCompleteRequest = {
      ...cfnRequest,
      ...onEventResult
    };

    // now immediate invoke isComplete.
    if (await executeIsCompleteUserHandler(isCompleteEvent)) {
      return;
    }

    const waiter = {
      stateMachineArn: getEnv(consts.ENV_WAITER_STATE_MACHINE_ARN),
      name: `${isCompleteEvent.RequestType}:${isCompleteEvent.PhysicalResourceId}`,
      input: JSON.stringify(isCompleteEvent),
    };

    log('starting waiter', waiter);

    // kick off waiter state machine
    await startWaiterSfnExecution(waiter);
    return;
  });
}

// invoked a few times until `complete` is true or until it times out.
export async function isCompleteHandler(event: AWSCDKAsyncCustomResource.IsCompleteRequest) {
  return await failOnError(event, async () => {
    log('isCompleteHandler', event);
    if (!await executeIsCompleteUserHandler(event)) {
      throw new Retry(JSON.stringify(event));
    }
  });
}

// invoked when completion retries are exhaused.
export async function timeoutHandler(timeoutEvent: any) {
  log('timeoutHandler', timeoutEvent);

  const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage) as AWSCDKAsyncCustomResource.IsCompleteRequest;
  await submitCloudFormationResponse('FAILED', isCompleteRequest, {
    reason: 'Operation timed out'
  });
}

/**
 * Invokes the user-defined "onEvent" handler.
 */
async function executeOnEventUserHandler(onEventRequest: AWSCDKAsyncCustomResource.OnEventRequest) {
  log('executing user onEvent:', onEventRequest);
  const userHandler = await requireUserHandler(consts.ENV_ON_EVENT_USER_HANDLER_FILE, consts.ENV_ON_EVENT_USER_HANDLER_FUNCTION) as AWSCDKAsyncCustomResource.OnEventHandler;
  const resp = await userHandler(onEventRequest);
  log('onEvent returned:', resp);
  return resp;
}

/**
 * Invokes the user-defined "isComplete" handler.
 */
async function executeIsCompleteUserHandler(isCompleteRequest: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<boolean> {
  log('executing user isComplete:', isCompleteRequest);
  const userHandler = await requireUserHandler(consts.ENV_IS_COMPLETE_USER_HANDLER_FILE, consts.ENV_IS_COMPLETE_USER_HANDLER_FUNCTION) as AWSCDKAsyncCustomResource.IsCompleteHandler;
  const isCompleteResult = await userHandler(isCompleteRequest);
  log('isComplete returned:', isCompleteResult);

  // if we are not complete, reeturn false, and don't send a response back.
  if (!isCompleteResult.IsComplete) {
    return false;
  }

  const event = {
    ...isCompleteRequest,
    Data: {
      ...isCompleteRequest.Data,
      ...isCompleteResult.Data
    }
  };

  await submitCloudFormationResponse('SUCCESS', event);
  return true;
}

function validatePhysicalResourceId(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent, onEventResult: AWSCDKAsyncCustomResource.OnEventResponse = { }) {
  onEventResult = onEventResult || { };
  switch (cfnRequest.RequestType) {
    case 'Create':
      if (onEventResult.PhysicalResourceId == null) {
        throw new Error(`CREATE: onEvent response must include a PhysicalResourceId for the new resource`);
      }
      break;
    case 'Update':
      if (onEventResult.PhysicalResourceId && onEventResult.PhysicalResourceId !== cfnRequest.PhysicalResourceId) {
        console.info(`UPDATE: changing physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}"`);
      }
      break;
    case 'Delete':
      if (onEventResult.PhysicalResourceId && onEventResult.PhysicalResourceId !== cfnRequest.PhysicalResourceId) {
        throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}" during deletion`);
      }
  }
}

function validateCfnRequest(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent) {
  const errorPrefix = `Invalid CloudFormation custom resource event (${cfnRequest.RequestType || ''}):`;

  [ 'LogicalResourceId', 'RequestId', 'RequestType', 'ResponseURL', 'StackId', 'ServiceToken' ].forEach(field => {
    if (!(cfnRequest as any)[field]) {
      throw new Error(`${errorPrefix} ${field} is required`);
    }
  });

  if (cfnRequest.RequestType === 'Create' && (cfnRequest as any).PhysicalResourceId) {
    throw new Error(`${errorPrefix} PhysicalResourceId is not allowed for "Create" events`);
  }

  if ((cfnRequest.RequestType === 'Update' || cfnRequest.RequestType === 'Delete') && !cfnRequest.PhysicalResourceId) {
    throw new Error(`${errorPrefix} PhysicalResourceId is required for "Update" and "Delete" events`);
  }
}