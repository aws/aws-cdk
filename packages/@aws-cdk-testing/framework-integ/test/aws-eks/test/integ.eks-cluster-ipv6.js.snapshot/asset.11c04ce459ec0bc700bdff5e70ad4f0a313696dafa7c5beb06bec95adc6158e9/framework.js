"use strict";
/* eslint-disable @cdklabs/no-throw-default-error */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
/* eslint-disable max-len */
const cfnResponse = __importStar(require("./cfn-response"));
const consts = __importStar(require("./consts"));
const outbound_1 = require("./outbound");
const response_url_1 = require("./response-url");
const util_1 = require("./util");
/**
 * The main runtime entrypoint of the async custom resource lambda function.
 *
 * Any lifecycle event changes to the custom resources will invoke this handler, which will, in turn,
 * interact with the user-defined `onEvent` and `isComplete` handlers.
 *
 * This function will always succeed. If an error occurs, it is logged but an error is not thrown.
 *
 * @param cfnRequest The cloudformation custom resource event.
 */
async function onEvent(cfnRequest) {
    const sanitizedRequest = { ...cfnRequest, ResponseURL: '...' };
    (0, util_1.log)('onEventHandler', sanitizedRequest);
    cfnRequest.ResourceProperties = cfnRequest.ResourceProperties || {};
    const onEventResult = await invokeUserFunction(consts.USER_ON_EVENT_FUNCTION_ARN_ENV, sanitizedRequest, cfnRequest.ResponseURL);
    if (onEventResult?.NoEcho) {
        (0, util_1.log)('redacted onEvent returned:', cfnResponse.redactDataFromPayload(onEventResult));
    }
    else {
        (0, util_1.log)('onEvent returned:', onEventResult);
    }
    // merge the request and the result from onEvent to form the complete resource event
    // this also performs validation.
    const resourceEvent = createResponseEvent(cfnRequest, onEventResult);
    const sanitizedEvent = { ...resourceEvent, ResponseURL: '...' };
    if (onEventResult?.NoEcho) {
        (0, util_1.log)('readacted event:', cfnResponse.redactDataFromPayload(sanitizedEvent));
    }
    else {
        (0, util_1.log)('event:', sanitizedEvent);
    }
    // determine if this is an async provider based on whether we have an isComplete handler defined.
    // if it is not defined, then we are basically ready to return a positive response.
    if (!process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV]) {
        return cfnResponse.submitResponse('SUCCESS', resourceEvent, { noEcho: resourceEvent.NoEcho });
    }
    // The ResponseURL is a presigned URL that authorizes writing the result of this
    // custom resource. Keep it out of the state machine execution state (and out of
    // anything thrown back to the state machine) by parking it in SSM and passing
    // only the parameter name along.
    const responseUrlParameterName = `${(0, util_1.getEnv)(consts.RESPONSE_URL_PARAMETER_PREFIX_ENV)}/${cfnRequest.RequestId}`;
    await (0, outbound_1.putParameter)({
        Name: responseUrlParameterName,
        Value: cfnRequest.ResponseURL,
        Type: 'String',
        Overwrite: true,
    });
    const waiterEvent = {
        ...resourceEvent,
        ResponseURL: consts.RESPONSE_URL_REDACTED,
        ResponseURLParameterName: responseUrlParameterName,
    };
    // ok, we are not complete, so kick off the waiter workflow
    const waiter = {
        stateMachineArn: (0, util_1.getEnv)(consts.WAITER_STATE_MACHINE_ARN_ENV),
        input: JSON.stringify(waiterEvent),
    };
    (0, util_1.log)('starting waiter', {
        stateMachineArn: (0, util_1.getEnv)(consts.WAITER_STATE_MACHINE_ARN_ENV),
    });
    // kick off waiter state machine
    try {
        await (0, outbound_1.startExecution)(waiter);
    }
    catch (e) {
        // nothing will read the parameter if the waiter never started
        await (0, response_url_1.forgetResponseUrl)(waiterEvent);
        throw e;
    }
}
// invoked a few times until `complete` is true or until it times out.
async function isComplete(event) {
    const sanitizedRequest = { ...event, ResponseURL: '...' };
    if (event?.NoEcho) {
        (0, util_1.log)('redacted isComplete request', cfnResponse.redactDataFromPayload(sanitizedRequest));
    }
    else {
        (0, util_1.log)('isComplete', sanitizedRequest);
    }
    // user handlers still receive the real URL, so it has to be read back here
    const responseUrl = await (0, response_url_1.resolveResponseUrl)(event);
    const isCompleteResult = await invokeUserFunction(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, sanitizedRequest, responseUrl);
    if (event?.NoEcho) {
        (0, util_1.log)('redacted user isComplete returned:', cfnResponse.redactDataFromPayload(isCompleteResult));
    }
    else {
        (0, util_1.log)('user isComplete returned:', isCompleteResult);
    }
    // if we are not complete, return false, and don't send a response back.
    if (!isCompleteResult.IsComplete) {
        if (isCompleteResult.Data && Object.keys(isCompleteResult.Data).length > 0) {
            throw new Error('"Data" is not allowed if "IsComplete" is "False"');
        }
        // This must be the full event, it will be deserialized in `onTimeout` to send the response to CloudFormation.
        // `event.ResponseURL` is the redacted placeholder here, so the presigned URL does not reach the state
        // machine error output or the runtime's log of this uncaught error. `onTimeout` reads it back from SSM.
        throw new cfnResponse.Retry(JSON.stringify(event));
    }
    const response = {
        ...event,
        ...isCompleteResult,
        Data: {
            ...event.Data,
            ...isCompleteResult.Data,
        },
    };
    await cfnResponse.submitResponse('SUCCESS', response, { noEcho: event.NoEcho });
    await (0, response_url_1.forgetResponseUrl)(event);
}
// invoked when completion retries are exhaused.
async function onTimeout(timeoutEvent) {
    (0, util_1.log)('timeoutHandler', timeoutEvent);
    const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage);
    await cfnResponse.submitResponse('FAILED', isCompleteRequest, {
        reason: 'Operation timed out',
    });
    await (0, response_url_1.forgetResponseUrl)(isCompleteRequest);
}
async function invokeUserFunction(functionArnEnv, sanitizedPayload, responseUrl) {
    const functionArn = (0, util_1.getEnv)(functionArnEnv);
    (0, util_1.log)(`executing user function ${functionArn} with payload`, sanitizedPayload);
    // transient errors such as timeouts, throttling errors (429), and other
    // errors that aren't caused by a bad request (500 series) are retried
    // automatically by the JavaScript SDK.
    const resp = await (0, outbound_1.invokeFunction)({
        FunctionName: functionArn,
        // Cannot strip 'ResponseURL' here as this would be a breaking change even though the downstream CR doesn't need it
        Payload: JSON.stringify({ ...sanitizedPayload, ResponseURL: responseUrl }),
    });
    (0, util_1.log)('user function response:', resp, typeof (resp));
    // ParseJsonPayload is very defensive. It should not be possible for `Payload`
    // to be anything other than a JSON encoded string (or intarray). Something weird is
    // going on if that happens. Still, we should do our best to survive it.
    const jsonPayload = (0, util_1.parseJsonPayload)(resp.Payload);
    if (resp.FunctionError) {
        (0, util_1.log)('user function threw an error:', resp.FunctionError);
        const errorMessage = jsonPayload.errorMessage || 'error';
        // parse function name from arn
        // arn:${Partition}:lambda:${Region}:${Account}:function:${FunctionName}
        const arn = functionArn.split(':');
        const functionName = arn[arn.length - 1];
        // append a reference to the log group.
        const message = [
            errorMessage,
            '',
            `Logs: /aws/lambda/${functionName}`, // cloudwatch log group
            '',
        ].join('\n');
        const e = new Error(message);
        // the output that goes to CFN is what's in `stack`, not the error message.
        // if we have a remote trace, construct a nice message with log group information
        if (jsonPayload.trace) {
            // skip first trace line because it's the message
            e.stack = [message, ...jsonPayload.trace.slice(1)].join('\n');
        }
        throw e;
    }
    return jsonPayload;
}
function createResponseEvent(cfnRequest, onEventResult) {
    //
    // validate that onEventResult always includes a PhysicalResourceId
    onEventResult = onEventResult || {};
    // if physical ID is not returned, we have some defaults for you based
    // on the request type.
    const physicalResourceId = onEventResult.PhysicalResourceId || defaultPhysicalResourceId(cfnRequest);
    // if we are in DELETE and physical ID was changed, it's an error.
    if (cfnRequest.RequestType === 'Delete' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
        throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}" during deletion`);
    }
    // if we are in UPDATE and physical ID was changed, it's a replacement (just log)
    if (cfnRequest.RequestType === 'Update' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
        (0, util_1.log)(`UPDATE: changing physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${onEventResult.PhysicalResourceId}"`);
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
function defaultPhysicalResourceId(req) {
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
module.exports = {
    [consts.FRAMEWORK_ON_EVENT_HANDLER_NAME]: cfnResponse.safeHandler(onEvent),
    [consts.FRAMEWORK_IS_COMPLETE_HANDLER_NAME]: cfnResponse.safeHandler(isComplete),
    [consts.FRAMEWORK_ON_TIMEOUT_HANDLER_NAME]: onTimeout,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvREFBb0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFcEQsNEJBQTRCO0FBRTVCLDREQUE4QztBQUM5QyxpREFBbUM7QUFDbkMseUNBQTBFO0FBQzFFLGlEQUF1RTtBQUN2RSxpQ0FBdUQ7QUFvQnZEOzs7Ozs7Ozs7R0FTRztBQUNILEtBQUssVUFBVSxPQUFPLENBQUMsVUFBdUQ7SUFDNUUsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQVcsQ0FBQztJQUN4RSxJQUFBLFVBQUcsRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRXhDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLElBQUksRUFBRyxDQUFDO0lBRXJFLE1BQU0sYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsTUFBTSxDQUFDLDhCQUE4QixFQUFFLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQW9CLENBQUM7SUFDbkosSUFBSSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDMUIsSUFBQSxVQUFHLEVBQUMsNEJBQTRCLEVBQUUsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztTQUFNLENBQUM7UUFDTixJQUFBLFVBQUcsRUFBQyxtQkFBbUIsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsb0ZBQW9GO0lBQ3BGLGlDQUFpQztJQUNqQyxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDckUsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLGFBQWEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDaEUsSUFB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bUJBQW1CLENBQUMsQ0FBQztJQUNySyxDQUFDO0lBRUQsaUZBQWlGO0lBQ2pGLElBQUksVUFBVSxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksa0JBQWtCLEtBQUssVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDaEcsSUFBQSxVQUFHLEVBQUMsK0NBQStDLFVBQVUsQ0FBQyxrQkFBa0IsU0FBUyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0lBQ2hJLENBQUM7SUFFRCwwREFBMEQ7SUFDMUQsT0FBTztRQUNMLEdBQUcsVUFBVTtRQUNiLEdBQUcsYUFBYTtRQUNoQixrQkFBa0IsRUFBRSxrQkFBa0I7S0FDdkMsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLHlCQUF5QixDQUFDLEdBQWdEO0lBQ2pGLFFBQVEsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hCLEtBQUssUUFBUTtZQUNYLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV2QixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO1FBRWhDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakYsQ0FBQztBQUNILENBQUM7QUE5T0QsaUJBQVM7SUFDUCxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0lBQzFFLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7SUFDaEYsQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsRUFBRSxTQUFTO0NBQ3RELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAY2RrbGFicy9uby10aHJvdy1kZWZhdWx0LWVycm9yICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaW1wb3J0ICogYXMgY2ZuUmVzcG9uc2UgZnJvbSAnLi9jZm4tcmVzcG9uc2UnO1xuaW1wb3J0ICogYXMgY29uc3RzIGZyb20gJy4vY29uc3RzJztcbmltcG9ydCB7IGludm9rZUZ1bmN0aW9uLCBwdXRQYXJhbWV0ZXIsIHN0YXJ0RXhlY3V0aW9uIH0gZnJvbSAnLi9vdXRib3VuZCc7XG5pbXBvcnQgeyBmb3JnZXRSZXNwb25zZVVybCwgcmVzb2x2ZVJlc3BvbnNlVXJsIH0gZnJvbSAnLi9yZXNwb25zZS11cmwnO1xuaW1wb3J0IHsgZ2V0RW52LCBsb2csIHBhcnNlSnNvblBheWxvYWQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHR5cGUgeyBJc0NvbXBsZXRlUmVzcG9uc2UsIE9uRXZlbnRSZXNwb25zZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgZXZlbnQgY2FycmllZCB0aHJvdWdoIHRoZSB3YWl0ZXIgc3RhdGUgbWFjaGluZS5cbiAqXG4gKiBJZGVudGljYWwgdG8gdGhlIHVzZXItZmFjaW5nIGBJc0NvbXBsZXRlUmVxdWVzdGAsIHBsdXMgdGhlIGludGVybmFsIHJlZmVyZW5jZVxuICogdG8gdGhlIHN0b3JlZCByZXNwb25zZSBVUkwuIE5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgaGFuZGxlciBjb250cmFjdC5cbiAqL1xudHlwZSBXYWl0ZXJFdmVudCA9IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3QgJiB7XG4gIFJlc3BvbnNlVVJMUGFyYW1ldGVyTmFtZT86IHN0cmluZztcbn07XG5cbi8vIHVzZSBjb25zdHMgZm9yIGhhbmRsZXIgbmFtZXMgdG8gY29tcGlsZXItZW5mb3JjZSB0aGUgY291cGxpbmcgd2l0aCBjb25zdHJ1Y3Rpb24gY29kZS5cbmV4cG9ydCA9IHtcbiAgW2NvbnN0cy5GUkFNRVdPUktfT05fRVZFTlRfSEFORExFUl9OQU1FXTogY2ZuUmVzcG9uc2Uuc2FmZUhhbmRsZXIob25FdmVudCksXG4gIFtjb25zdHMuRlJBTUVXT1JLX0lTX0NPTVBMRVRFX0hBTkRMRVJfTkFNRV06IGNmblJlc3BvbnNlLnNhZmVIYW5kbGVyKGlzQ29tcGxldGUpLFxuICBbY29uc3RzLkZSQU1FV09SS19PTl9USU1FT1VUX0hBTkRMRVJfTkFNRV06IG9uVGltZW91dCxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gcnVudGltZSBlbnRyeXBvaW50IG9mIHRoZSBhc3luYyBjdXN0b20gcmVzb3VyY2UgbGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEFueSBsaWZlY3ljbGUgZXZlbnQgY2hhbmdlcyB0byB0aGUgY3VzdG9tIHJlc291cmNlcyB3aWxsIGludm9rZSB0aGlzIGhhbmRsZXIsIHdoaWNoIHdpbGwsIGluIHR1cm4sXG4gKiBpbnRlcmFjdCB3aXRoIHRoZSB1c2VyLWRlZmluZWQgYG9uRXZlbnRgIGFuZCBgaXNDb21wbGV0ZWAgaGFuZGxlcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGFsd2F5cyBzdWNjZWVkLiBJZiBhbiBlcnJvciBvY2N1cnMsIGl0IGlzIGxvZ2dlZCBidXQgYW4gZXJyb3IgaXMgbm90IHRocm93bi5cbiAqXG4gKiBAcGFyYW0gY2ZuUmVxdWVzdCBUaGUgY2xvdWRmb3JtYXRpb24gY3VzdG9tIHJlc291cmNlIGV2ZW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBvbkV2ZW50KGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3Qgc2FuaXRpemVkUmVxdWVzdCA9IHsgLi4uY2ZuUmVxdWVzdCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0gYXMgY29uc3Q7XG4gIGxvZygnb25FdmVudEhhbmRsZXInLCBzYW5pdGl6ZWRSZXF1ZXN0KTtcblxuICBjZm5SZXF1ZXN0LlJlc291cmNlUHJvcGVydGllcyA9IGNmblJlcXVlc3QuUmVzb3VyY2VQcm9wZXJ0aWVzIHx8IHsgfTtcblxuICBjb25zdCBvbkV2ZW50UmVzdWx0ID0gYXdhaXQgaW52b2tlVXNlckZ1bmN0aW9uKGNvbnN0cy5VU0VSX09OX0VWRU5UX0ZVTkNUSU9OX0FSTl9FTlYsIHNhbml0aXplZFJlcXVlc3QsIGNmblJlcXVlc3QuUmVzcG9uc2VVUkwpIGFzIE9uRXZlbnRSZXNwb25zZTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgb25FdmVudCByZXR1cm5lZDonLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQob25FdmVudFJlc3VsdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnb25FdmVudCByZXR1cm5lZDonLCBvbkV2ZW50UmVzdWx0KTtcbiAgfVxuXG4gIC8vIG1lcmdlIHRoZSByZXF1ZXN0IGFuZCB0aGUgcmVzdWx0IGZyb20gb25FdmVudCB0byBmb3JtIHRoZSBjb21wbGV0ZSByZXNvdXJjZSBldmVudFxuICAvLyB0aGlzIGFsc28gcGVyZm9ybXMgdmFsaWRhdGlvbi5cbiAgY29uc3QgcmVzb3VyY2VFdmVudCA9IGNyZWF0ZVJlc3BvbnNlRXZlbnQoY2ZuUmVxdWVzdCwgb25FdmVudFJlc3VsdCk7XG4gIGNvbnN0IHNhbml0aXplZEV2ZW50ID0geyAuLi5yZXNvdXJjZUV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVhZGFjdGVkIGV2ZW50OicsIGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRFdmVudCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnZXZlbnQ6Jywgc2FuaXRpemVkRXZlbnQpO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGlmIHRoaXMgaXMgYW4gYXN5bmMgcHJvdmlkZXIgYmFzZWQgb24gd2hldGhlciB3ZSBoYXZlIGFuIGlzQ29tcGxldGUgaGFuZGxlciBkZWZpbmVkLlxuICAvLyBpZiBpdCBpcyBub3QgZGVmaW5lZCwgdGhlbiB3ZSBhcmUgYmFzaWNhbGx5IHJlYWR5IHRvIHJldHVybiBhIHBvc2l0aXZlIHJlc3BvbnNlLlxuICBpZiAoIXByb2Nlc3MuZW52W2NvbnN0cy5VU0VSX0lTX0NPTVBMRVRFX0ZVTkNUSU9OX0FSTl9FTlZdKSB7XG4gICAgcmV0dXJuIGNmblJlc3BvbnNlLnN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgcmVzb3VyY2VFdmVudCwgeyBub0VjaG86IHJlc291cmNlRXZlbnQuTm9FY2hvIH0pO1xuICB9XG5cbiAgLy8gVGhlIFJlc3BvbnNlVVJMIGlzIGEgcHJlc2lnbmVkIFVSTCB0aGF0IGF1dGhvcml6ZXMgd3JpdGluZyB0aGUgcmVzdWx0IG9mIHRoaXNcbiAgLy8gY3VzdG9tIHJlc291cmNlLiBLZWVwIGl0IG91dCBvZiB0aGUgc3RhdGUgbWFjaGluZSBleGVjdXRpb24gc3RhdGUgKGFuZCBvdXQgb2ZcbiAgLy8gYW55dGhpbmcgdGhyb3duIGJhY2sgdG8gdGhlIHN0YXRlIG1hY2hpbmUpIGJ5IHBhcmtpbmcgaXQgaW4gU1NNIGFuZCBwYXNzaW5nXG4gIC8vIG9ubHkgdGhlIHBhcmFtZXRlciBuYW1lIGFsb25nLlxuICBjb25zdCByZXNwb25zZVVybFBhcmFtZXRlck5hbWUgPSBgJHtnZXRFbnYoY29uc3RzLlJFU1BPTlNFX1VSTF9QQVJBTUVURVJfUFJFRklYX0VOVil9LyR7Y2ZuUmVxdWVzdC5SZXF1ZXN0SWR9YDtcbiAgYXdhaXQgcHV0UGFyYW1ldGVyKHtcbiAgICBOYW1lOiByZXNwb25zZVVybFBhcmFtZXRlck5hbWUsXG4gICAgVmFsdWU6IGNmblJlcXVlc3QuUmVzcG9uc2VVUkwsXG4gICAgVHlwZTogJ1N0cmluZycsXG4gICAgT3ZlcndyaXRlOiB0cnVlLFxuICB9KTtcblxuICBjb25zdCB3YWl0ZXJFdmVudDogV2FpdGVyRXZlbnQgPSB7XG4gICAgLi4ucmVzb3VyY2VFdmVudCxcbiAgICBSZXNwb25zZVVSTDogY29uc3RzLlJFU1BPTlNFX1VSTF9SRURBQ1RFRCxcbiAgICBSZXNwb25zZVVSTFBhcmFtZXRlck5hbWU6IHJlc3BvbnNlVXJsUGFyYW1ldGVyTmFtZSxcbiAgfTtcblxuICAvLyBvaywgd2UgYXJlIG5vdCBjb21wbGV0ZSwgc28ga2ljayBvZmYgdGhlIHdhaXRlciB3b3JrZmxvd1xuICBjb25zdCB3YWl0ZXIgPSB7XG4gICAgc3RhdGVNYWNoaW5lQXJuOiBnZXRFbnYoY29uc3RzLldBSVRFUl9TVEFURV9NQUNISU5FX0FSTl9FTlYpLFxuICAgIGlucHV0OiBKU09OLnN0cmluZ2lmeSh3YWl0ZXJFdmVudCksXG4gIH07XG5cbiAgbG9nKCdzdGFydGluZyB3YWl0ZXInLCB7XG4gICAgc3RhdGVNYWNoaW5lQXJuOiBnZXRFbnYoY29uc3RzLldBSVRFUl9TVEFURV9NQUNISU5FX0FSTl9FTlYpLFxuICB9KTtcblxuICAvLyBraWNrIG9mZiB3YWl0ZXIgc3RhdGUgbWFjaGluZVxuICB0cnkge1xuICAgIGF3YWl0IHN0YXJ0RXhlY3V0aW9uKHdhaXRlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBub3RoaW5nIHdpbGwgcmVhZCB0aGUgcGFyYW1ldGVyIGlmIHRoZSB3YWl0ZXIgbmV2ZXIgc3RhcnRlZFxuICAgIGF3YWl0IGZvcmdldFJlc3BvbnNlVXJsKHdhaXRlckV2ZW50KTtcbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbi8vIGludm9rZWQgYSBmZXcgdGltZXMgdW50aWwgYGNvbXBsZXRlYCBpcyB0cnVlIG9yIHVudGlsIGl0IHRpbWVzIG91dC5cbmFzeW5jIGZ1bmN0aW9uIGlzQ29tcGxldGUoZXZlbnQ6IFdhaXRlckV2ZW50KSB7XG4gIGNvbnN0IHNhbml0aXplZFJlcXVlc3QgPSB7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSBhcyBjb25zdDtcbiAgaWYgKGV2ZW50Py5Ob0VjaG8pIHtcbiAgICBsb2coJ3JlZGFjdGVkIGlzQ29tcGxldGUgcmVxdWVzdCcsIGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRSZXF1ZXN0KSk7XG4gIH0gZWxzZSB7XG4gICAgbG9nKCdpc0NvbXBsZXRlJywgc2FuaXRpemVkUmVxdWVzdCk7XG4gIH1cblxuICAvLyB1c2VyIGhhbmRsZXJzIHN0aWxsIHJlY2VpdmUgdGhlIHJlYWwgVVJMLCBzbyBpdCBoYXMgdG8gYmUgcmVhZCBiYWNrIGhlcmVcbiAgY29uc3QgcmVzcG9uc2VVcmwgPSBhd2FpdCByZXNvbHZlUmVzcG9uc2VVcmwoZXZlbnQpO1xuXG4gIGNvbnN0IGlzQ29tcGxldGVSZXN1bHQgPSBhd2FpdCBpbnZva2VVc2VyRnVuY3Rpb24oY29uc3RzLlVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOX0VOViwgc2FuaXRpemVkUmVxdWVzdCwgcmVzcG9uc2VVcmwpIGFzIElzQ29tcGxldGVSZXNwb25zZTtcbiAgaWYgKGV2ZW50Py5Ob0VjaG8pIHtcbiAgICBsb2coJ3JlZGFjdGVkIHVzZXIgaXNDb21wbGV0ZSByZXR1cm5lZDonLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQoaXNDb21wbGV0ZVJlc3VsdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygndXNlciBpc0NvbXBsZXRlIHJldHVybmVkOicsIGlzQ29tcGxldGVSZXN1bHQpO1xuICB9XG5cbiAgLy8gaWYgd2UgYXJlIG5vdCBjb21wbGV0ZSwgcmV0dXJuIGZhbHNlLCBhbmQgZG9uJ3Qgc2VuZCBhIHJlc3BvbnNlIGJhY2suXG4gIGlmICghaXNDb21wbGV0ZVJlc3VsdC5Jc0NvbXBsZXRlKSB7XG4gICAgaWYgKGlzQ29tcGxldGVSZXN1bHQuRGF0YSAmJiBPYmplY3Qua2V5cyhpc0NvbXBsZXRlUmVzdWx0LkRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJEYXRhXCIgaXMgbm90IGFsbG93ZWQgaWYgXCJJc0NvbXBsZXRlXCIgaXMgXCJGYWxzZVwiJyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBtdXN0IGJlIHRoZSBmdWxsIGV2ZW50LCBpdCB3aWxsIGJlIGRlc2VyaWFsaXplZCBpbiBgb25UaW1lb3V0YCB0byBzZW5kIHRoZSByZXNwb25zZSB0byBDbG91ZEZvcm1hdGlvbi5cbiAgICAvLyBgZXZlbnQuUmVzcG9uc2VVUkxgIGlzIHRoZSByZWRhY3RlZCBwbGFjZWhvbGRlciBoZXJlLCBzbyB0aGUgcHJlc2lnbmVkIFVSTCBkb2VzIG5vdCByZWFjaCB0aGUgc3RhdGVcbiAgICAvLyBtYWNoaW5lIGVycm9yIG91dHB1dCBvciB0aGUgcnVudGltZSdzIGxvZyBvZiB0aGlzIHVuY2F1Z2h0IGVycm9yLiBgb25UaW1lb3V0YCByZWFkcyBpdCBiYWNrIGZyb20gU1NNLlxuICAgIHRocm93IG5ldyBjZm5SZXNwb25zZS5SZXRyeShKU09OLnN0cmluZ2lmeShldmVudCkpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgLi4uZXZlbnQsXG4gICAgLi4uaXNDb21wbGV0ZVJlc3VsdCxcbiAgICBEYXRhOiB7XG4gICAgICAuLi5ldmVudC5EYXRhLFxuICAgICAgLi4uaXNDb21wbGV0ZVJlc3VsdC5EYXRhLFxuICAgIH0sXG4gIH07XG5cbiAgYXdhaXQgY2ZuUmVzcG9uc2Uuc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCByZXNwb25zZSwgeyBub0VjaG86IGV2ZW50Lk5vRWNobyB9KTtcbiAgYXdhaXQgZm9yZ2V0UmVzcG9uc2VVcmwoZXZlbnQpO1xufVxuXG4vLyBpbnZva2VkIHdoZW4gY29tcGxldGlvbiByZXRyaWVzIGFyZSBleGhhdXNlZC5cbmFzeW5jIGZ1bmN0aW9uIG9uVGltZW91dCh0aW1lb3V0RXZlbnQ6IGFueSkge1xuICBsb2coJ3RpbWVvdXRIYW5kbGVyJywgdGltZW91dEV2ZW50KTtcblxuICBjb25zdCBpc0NvbXBsZXRlUmVxdWVzdCA9IEpTT04ucGFyc2UoSlNPTi5wYXJzZSh0aW1lb3V0RXZlbnQuQ2F1c2UpLmVycm9yTWVzc2FnZSkgYXMgV2FpdGVyRXZlbnQ7XG4gIGF3YWl0IGNmblJlc3BvbnNlLnN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCBpc0NvbXBsZXRlUmVxdWVzdCwge1xuICAgIHJlYXNvbjogJ09wZXJhdGlvbiB0aW1lZCBvdXQnLFxuICB9KTtcbiAgYXdhaXQgZm9yZ2V0UmVzcG9uc2VVcmwoaXNDb21wbGV0ZVJlcXVlc3QpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbnZva2VVc2VyRnVuY3Rpb248QSBleHRlbmRzIHsgUmVzcG9uc2VVUkw6ICcuLi4nIH0+KGZ1bmN0aW9uQXJuRW52OiBzdHJpbmcsIHNhbml0aXplZFBheWxvYWQ6IEEsIHJlc3BvbnNlVXJsOiBzdHJpbmcpIHtcbiAgY29uc3QgZnVuY3Rpb25Bcm4gPSBnZXRFbnYoZnVuY3Rpb25Bcm5FbnYpO1xuICBsb2coYGV4ZWN1dGluZyB1c2VyIGZ1bmN0aW9uICR7ZnVuY3Rpb25Bcm59IHdpdGggcGF5bG9hZGAsIHNhbml0aXplZFBheWxvYWQpO1xuXG4gIC8vIHRyYW5zaWVudCBlcnJvcnMgc3VjaCBhcyB0aW1lb3V0cywgdGhyb3R0bGluZyBlcnJvcnMgKDQyOSksIGFuZCBvdGhlclxuICAvLyBlcnJvcnMgdGhhdCBhcmVuJ3QgY2F1c2VkIGJ5IGEgYmFkIHJlcXVlc3QgKDUwMCBzZXJpZXMpIGFyZSByZXRyaWVkXG4gIC8vIGF1dG9tYXRpY2FsbHkgYnkgdGhlIEphdmFTY3JpcHQgU0RLLlxuICBjb25zdCByZXNwID0gYXdhaXQgaW52b2tlRnVuY3Rpb24oe1xuICAgIEZ1bmN0aW9uTmFtZTogZnVuY3Rpb25Bcm4sXG5cbiAgICAvLyBDYW5ub3Qgc3RyaXAgJ1Jlc3BvbnNlVVJMJyBoZXJlIGFzIHRoaXMgd291bGQgYmUgYSBicmVha2luZyBjaGFuZ2UgZXZlbiB0aG91Z2ggdGhlIGRvd25zdHJlYW0gQ1IgZG9lc24ndCBuZWVkIGl0XG4gICAgUGF5bG9hZDogSlNPTi5zdHJpbmdpZnkoeyAuLi5zYW5pdGl6ZWRQYXlsb2FkLCBSZXNwb25zZVVSTDogcmVzcG9uc2VVcmwgfSksXG4gIH0pO1xuXG4gIGxvZygndXNlciBmdW5jdGlvbiByZXNwb25zZTonLCByZXNwLCB0eXBlb2YocmVzcCkpO1xuXG4gIC8vIFBhcnNlSnNvblBheWxvYWQgaXMgdmVyeSBkZWZlbnNpdmUuIEl0IHNob3VsZCBub3QgYmUgcG9zc2libGUgZm9yIGBQYXlsb2FkYFxuICAvLyB0byBiZSBhbnl0aGluZyBvdGhlciB0aGFuIGEgSlNPTiBlbmNvZGVkIHN0cmluZyAob3IgaW50YXJyYXkpLiBTb21ldGhpbmcgd2VpcmQgaXNcbiAgLy8gZ29pbmcgb24gaWYgdGhhdCBoYXBwZW5zLiBTdGlsbCwgd2Ugc2hvdWxkIGRvIG91ciBiZXN0IHRvIHN1cnZpdmUgaXQuXG4gIGNvbnN0IGpzb25QYXlsb2FkID0gcGFyc2VKc29uUGF5bG9hZChyZXNwLlBheWxvYWQpO1xuICBpZiAocmVzcC5GdW5jdGlvbkVycm9yKSB7XG4gICAgbG9nKCd1c2VyIGZ1bmN0aW9uIHRocmV3IGFuIGVycm9yOicsIHJlc3AuRnVuY3Rpb25FcnJvcik7XG5cbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBqc29uUGF5bG9hZC5lcnJvck1lc3NhZ2UgfHwgJ2Vycm9yJztcblxuICAgIC8vIHBhcnNlIGZ1bmN0aW9uIG5hbWUgZnJvbSBhcm5cbiAgICAvLyBhcm46JHtQYXJ0aXRpb259OmxhbWJkYToke1JlZ2lvbn06JHtBY2NvdW50fTpmdW5jdGlvbjoke0Z1bmN0aW9uTmFtZX1cbiAgICBjb25zdCBhcm4gPSBmdW5jdGlvbkFybi5zcGxpdCgnOicpO1xuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGFyblthcm4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyBhcHBlbmQgYSByZWZlcmVuY2UgdG8gdGhlIGxvZyBncm91cC5cbiAgICBjb25zdCBtZXNzYWdlID0gW1xuICAgICAgZXJyb3JNZXNzYWdlLFxuICAgICAgJycsXG4gICAgICBgTG9nczogL2F3cy9sYW1iZGEvJHtmdW5jdGlvbk5hbWV9YCwgLy8gY2xvdWR3YXRjaCBsb2cgZ3JvdXBcbiAgICAgICcnLFxuICAgIF0uam9pbignXFxuJyk7XG5cbiAgICBjb25zdCBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuXG4gICAgLy8gdGhlIG91dHB1dCB0aGF0IGdvZXMgdG8gQ0ZOIGlzIHdoYXQncyBpbiBgc3RhY2tgLCBub3QgdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIHJlbW90ZSB0cmFjZSwgY29uc3RydWN0IGEgbmljZSBtZXNzYWdlIHdpdGggbG9nIGdyb3VwIGluZm9ybWF0aW9uXG4gICAgaWYgKGpzb25QYXlsb2FkLnRyYWNlKSB7XG4gICAgICAvLyBza2lwIGZpcnN0IHRyYWNlIGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBtZXNzYWdlXG4gICAgICBlLnN0YWNrID0gW21lc3NhZ2UsIC4uLmpzb25QYXlsb2FkLnRyYWNlLnNsaWNlKDEpXS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgcmV0dXJuIGpzb25QYXlsb2FkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXNwb25zZUV2ZW50KGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIG9uRXZlbnRSZXN1bHQ6IE9uRXZlbnRSZXNwb25zZSk6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3Qge1xuICAvL1xuICAvLyB2YWxpZGF0ZSB0aGF0IG9uRXZlbnRSZXN1bHQgYWx3YXlzIGluY2x1ZGVzIGEgUGh5c2ljYWxSZXNvdXJjZUlkXG5cbiAgb25FdmVudFJlc3VsdCA9IG9uRXZlbnRSZXN1bHQgfHwgeyB9O1xuXG4gIC8vIGlmIHBoeXNpY2FsIElEIGlzIG5vdCByZXR1cm5lZCwgd2UgaGF2ZSBzb21lIGRlZmF1bHRzIGZvciB5b3UgYmFzZWRcbiAgLy8gb24gdGhlIHJlcXVlc3QgdHlwZS5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gb25FdmVudFJlc3VsdC5QaHlzaWNhbFJlc291cmNlSWQgfHwgZGVmYXVsdFBoeXNpY2FsUmVzb3VyY2VJZChjZm5SZXF1ZXN0KTtcblxuICAvLyBpZiB3ZSBhcmUgaW4gREVMRVRFIGFuZCBwaHlzaWNhbCBJRCB3YXMgY2hhbmdlZCwgaXQncyBhbiBlcnJvci5cbiAgaWYgKGNmblJlcXVlc3QuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIHBoeXNpY2FsUmVzb3VyY2VJZCAhPT0gY2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYERFTEVURTogY2Fubm90IGNoYW5nZSB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgZnJvbSBcIiR7Y2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWR9XCIgdG8gXCIke29uRXZlbnRSZXN1bHQuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIGR1cmluZyBkZWxldGlvbmApO1xuICB9XG5cbiAgLy8gaWYgd2UgYXJlIGluIFVQREFURSBhbmQgcGh5c2ljYWwgSUQgd2FzIGNoYW5nZWQsIGl0J3MgYSByZXBsYWNlbWVudCAoanVzdCBsb2cpXG4gIGlmIChjZm5SZXF1ZXN0LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJyAmJiBwaHlzaWNhbFJlc291cmNlSWQgIT09IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgbG9nKGBVUERBVEU6IGNoYW5naW5nIHBoeXNpY2FsIHJlc291cmNlIElEIGZyb20gXCIke2NmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIHRvIFwiJHtvbkV2ZW50UmVzdWx0LlBoeXNpY2FsUmVzb3VyY2VJZH1cImApO1xuICB9XG5cbiAgLy8gbWVyZ2UgcmVxdWVzdCBldmVudCBhbmQgcmVzdWx0IGV2ZW50IChyZXN1bHQgcHJldmFpbHMpLlxuICByZXR1cm4ge1xuICAgIC4uLmNmblJlcXVlc3QsXG4gICAgLi4ub25FdmVudFJlc3VsdCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgfTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZWZhdWx0IHBoeXNpY2FsIHJlc291cmNlIElEIGJhc2VkIGluIGNhc2UgdXNlciBoYW5kbGVyIGRpZFxuICogbm90IHJldHVybiBhIFBoeXNpY2FsUmVzb3VyY2VJZC5cbiAqXG4gKiBGb3IgXCJDUkVBVEVcIiwgaXQgdXNlcyB0aGUgUmVxdWVzdElkLlxuICogRm9yIFwiVVBEQVRFXCIgYW5kIFwiREVMRVRFXCIgYW5kIHJldHVybnMgdGhlIGN1cnJlbnQgUGh5c2ljYWxSZXNvdXJjZUlkICh0aGUgb25lIHByb3ZpZGVkIGluIGBldmVudGApLlxuICovXG5mdW5jdGlvbiBkZWZhdWx0UGh5c2ljYWxSZXNvdXJjZUlkKHJlcTogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCk6IHN0cmluZyB7XG4gIHN3aXRjaCAocmVxLlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIHJldHVybiByZXEuUmVxdWVzdElkO1xuXG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIHJlcS5QaHlzaWNhbFJlc291cmNlSWQ7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFwiUmVxdWVzdFR5cGVcIiBpbiByZXF1ZXN0IFwiJHtKU09OLnN0cmluZ2lmeShyZXEpfVwiYCk7XG4gIH1cbn1cbiJdfQ==