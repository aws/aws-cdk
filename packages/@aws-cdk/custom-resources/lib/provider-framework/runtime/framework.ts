// tslint:disable: no-console
// tslint:disable: max-line-length
import { IsCompleteResponse, OnEventResponse } from '../types';
import { submitCloudFormationResponse } from './cfn-response';
import consts = require('./consts');
import { invokeFunction, startExecution } from './outbound';
import { failOnError, getEnv, log, Retry } from './util';

// use consts for handler names to compiler-enforce the coupling with construction code.
export = {
  [consts.FRAMEWORK_ON_EVENT_HANDLER_NAME]: onEvent,
  [consts.FRAMEWORK_IS_COMPLETE_HANDLER_NAME]: isComplete,
  [consts.FRAMEWORK_ON_TIMEOUT_HANDLER_NAME]: onTimeout
};

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
async function onEvent(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent) {
  await failOnError(cfnRequest, async () => {
    log('onEventHandler', cfnRequest);

    cfnRequest.ResourceProperties = cfnRequest.ResourceProperties || { };

    // validate incoming request
    validateCfnRequest(cfnRequest);

    const onEventResult = await invokeUserFunction(consts.USER_ON_EVENT_FUNCTION_ARN_ENV, cfnRequest) as OnEventResponse;
    log('onEvent returned:', onEventResult);

    // merge the request and the result from onEvent to form the complete resource event
    // this also performs validation.
    const resourceEvent = createResponseEvent(cfnRequest, onEventResult);
    log('event:', onEventResult);

    // determine if this is an async provider based on whether we have an isComplete handler defined.
    // if it is not defined, then we are basically ready to return a positive response.
    if (!process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV]) {
      await submitCloudFormationResponse('SUCCESS', resourceEvent);
      return;
    }

    // immediately invoke isComplete (the sync case).
    if (await invokeIsCompleteUserHandler(resourceEvent)) {
      return;
    }

    // ok, we are not complete, so kick off the waiter workflow
    const waiter = {
      stateMachineArn: getEnv(consts.WAITER_STATE_MACHINE_ARN_ENV),
      name: resourceEvent.RequestId,
      input: JSON.stringify(resourceEvent),
    };

    log('starting waiter', waiter);

    // kick off waiter state machine
    await startExecution(waiter);
    return;
  });
}

// invoked a few times until `complete` is true or until it times out.
async function isComplete(event: AWSCDKAsyncCustomResource.IsCompleteRequest) {
  return await failOnError(event, async () => {
    log('isCompleteHandler', event);
    if (!await invokeIsCompleteUserHandler(event)) {
      throw new Retry(JSON.stringify(event));
    }
  });
}

// invoked when completion retries are exhaused.
async function onTimeout(timeoutEvent: any) {
  log('timeoutHandler', timeoutEvent);

  const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage) as AWSCDKAsyncCustomResource.IsCompleteRequest;
  await submitCloudFormationResponse('FAILED', isCompleteRequest, {
    reason: 'Operation timed out'
  });
}

async function invokeUserFunction(arnEnvironment: string, payload: any) {
  const arn = getEnv(arnEnvironment);
  log(`executing user function ${arnEnvironment} with payload`, payload);
  const resp = await invokeFunction({ FunctionName: arn, Payload: JSON.stringify(payload) });

  log('user function response:', resp, typeof(resp));

  const jsonPayload = parseJsonPayload(resp.Payload);
  if (resp.FunctionError) {
    log('user function threw an error:', resp.FunctionError);
    const errorMessage = jsonPayload.errorMessage || 'error';
    const trace = jsonPayload.trace ? `\nRemote function error: ` + jsonPayload.trace.join('\n') : '';

    const e = new Error(errorMessage);
    e.stack += trace;
    throw e;
  }

  return jsonPayload;
}

function parseJsonPayload(payload: any): any {
  if (!payload) { return { }; }
  const text = payload.toString();
  try {
    return JSON.parse(text);
  } catch (e) {
    log('parse error:', e);
    return { text };
  }
}

/**
 * Invokes the user-defined "isComplete" handler.
 */
async function invokeIsCompleteUserHandler(isCompleteRequest: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<boolean> {
  log('executing user isComplete:', isCompleteRequest);
  const isCompleteResult = await invokeUserFunction(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, isCompleteRequest) as IsCompleteResponse;
  log('isComplete returned:', isCompleteResult);

  // if we are not complete, reeturn false, and don't send a response back.
  if (!isCompleteResult.IsComplete) {

    if (isCompleteResult.Data && Object.keys(isCompleteResult.Data).length > 0) {
      throw new Error(`"Data" is not allowed if "IsComplete" is "False"`);
    }

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

function createResponseEvent(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent, onEventResult: OnEventResponse): AWSCDKAsyncCustomResource.IsCompleteRequest {
  //
  // validate that onEventResult always includes a PhysicalResourceId

  if (!onEventResult || !onEventResult.PhysicalResourceId) {
    throw new Error(`onEvent response must include a PhysicalResourceId for all request types`);
  }

  // if we are in DELETE and physical ID was changed, it's an error.
  if (cfnRequest.RequestType === 'Delete' && onEventResult.PhysicalResourceId !== cfnRequest.PhysicalResourceId) {
    throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}" during deletion`);
  }

  // if we are in UPDATE and physical ID was changed, it's a replacement (just log)
  if (cfnRequest.RequestType === 'Update' && onEventResult.PhysicalResourceId !== cfnRequest.PhysicalResourceId) {
    log(`UPDATE: changing physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}"`);
  }

  // merge request event and result event (result prevails).
  return {
    ...cfnRequest,
    ...onEventResult
  };
}