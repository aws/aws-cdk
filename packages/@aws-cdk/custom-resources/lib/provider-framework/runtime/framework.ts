// tslint:disable: no-console
// tslint:disable: max-line-length
import { IsCompleteResponse, OnEventResponse } from '../types';
import * as cfnResponse from './cfn-response';
import * as consts from './consts';
import { invokeFunction, startExecution } from './outbound';
import { getEnv, log } from './util';

// use consts for handler names to compiler-enforce the coupling with construction code.
export = {
  [consts.FRAMEWORK_ON_EVENT_HANDLER_NAME]: cfnResponse.safeHandler(onEvent),
  [consts.FRAMEWORK_IS_COMPLETE_HANDLER_NAME]: cfnResponse.safeHandler(isComplete),
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
  log('onEventHandler', cfnRequest);

  cfnRequest.ResourceProperties = cfnRequest.ResourceProperties || { };

  const onEventResult = await invokeUserFunction(consts.USER_ON_EVENT_FUNCTION_ARN_ENV, cfnRequest) as OnEventResponse;
  log('onEvent returned:', onEventResult);

  // merge the request and the result from onEvent to form the complete resource event
  // this also performs validation.
  const resourceEvent = createResponseEvent(cfnRequest, onEventResult);
  log('event:', onEventResult);

  // determine if this is an async provider based on whether we have an isComplete handler defined.
  // if it is not defined, then we are basically ready to return a positive response.
  if (!process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV]) {
    return await cfnResponse.submitResponse('SUCCESS', resourceEvent);
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
}

// invoked a few times until `complete` is true or until it times out.
async function isComplete(event: AWSCDKAsyncCustomResource.IsCompleteRequest) {
  log('isComplete', event);

  const isCompleteResult = await invokeUserFunction(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, event) as IsCompleteResponse;
  log('user isComplete returned:', isCompleteResult);

  // if we are not complete, reeturn false, and don't send a response back.
  if (!isCompleteResult.IsComplete) {
    if (isCompleteResult.Data && Object.keys(isCompleteResult.Data).length > 0) {
      throw new Error('"Data" is not allowed if "IsComplete" is "False"');
    }

    throw new cfnResponse.Retry(JSON.stringify(event));
  }

  const response = {
    ...event,
    Data: {
      ...event.Data,
      ...isCompleteResult.Data
    }
  };

  await cfnResponse.submitResponse('SUCCESS', response);
}

// invoked when completion retries are exhaused.
async function onTimeout(timeoutEvent: any) {
  log('timeoutHandler', timeoutEvent);

  const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage) as AWSCDKAsyncCustomResource.IsCompleteRequest;
  await cfnResponse.submitResponse('FAILED', isCompleteRequest, {
    reason: 'Operation timed out'
  });
}

async function invokeUserFunction(functionArnEnv: string, payload: any) {
  const functionArn = getEnv(functionArnEnv);
  log(`executing user function ${functionArn} with payload`, payload);

  // transient errors such as timeouts, throttling errors (429), and other
  // errors that aren't caused by a bad request (500 series) are retried
  // automatically by the JavaScript SDK.
  const resp = await invokeFunction({
    FunctionName: functionArn,
    Payload: JSON.stringify(payload)
  });

  log('user function response:', resp, typeof(resp));

  const jsonPayload = parseJsonPayload(resp.Payload);
  if (resp.FunctionError) {
    log('user function threw an error:', resp.FunctionError);
    const errorMessage = jsonPayload.errorMessage || 'error';
    const trace = jsonPayload.trace ? '\nRemote function error: ' + jsonPayload.trace.join('\n') : '';

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
    throw new Error(`return values from user-handlers must be JSON objects. got: "${text}"`);
  }
}

function createResponseEvent(cfnRequest: AWSLambda.CloudFormationCustomResourceEvent, onEventResult: OnEventResponse): AWSCDKAsyncCustomResource.IsCompleteRequest {
  //
  // validate that onEventResult always includes a PhysicalResourceId

  onEventResult = onEventResult || { };

  // if physical ID is not returned, we have some defaults for you based
  // on the request type.
  const physicalResourceId = onEventResult.PhysicalResourceId || defaultPhysicalResourceId(cfnRequest);

  // if we are in DELETE and physical ID was changed, it's an error.
  if (cfnRequest.RequestType === 'Delete' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
    throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}" during deletion`);
  }

  // if we are in UPDATE and physical ID was changed, it's a replacement (just log)
  if (cfnRequest.RequestType === 'Update' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
    log(`UPDATE: changing physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}"`);
  }

  // merge request event and result event (result prevails).
  return {
    ...cfnRequest,
    ...onEventResult,
    PhysicalResourceId: physicalResourceId,
  };
}

/**
 * Calculates the default physical resource ID based in case user handler did
 * not return a PhysicalResourceId.
 *
 * For "CREATE", it uses the RequestId.
 * For "UPDATE" and "DELETE" and returns the current PhysicalResourceId (the one provided in `event`).
 */
function defaultPhysicalResourceId(req: AWSLambda.CloudFormationCustomResourceEvent): string {
  switch (req.RequestType) {
    case 'Create':
      return req.RequestId;

    case 'Update':
    case 'Delete':
      return req.PhysicalResourceId;

    default:
      throw new Error(`Invalid "RequestType" in request "${JSON.stringify(req)}"`);
  }
}
