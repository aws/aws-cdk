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
        (0, util_1.log)('redacted event:', cfnResponse.redactDataFromPayload(sanitizedEvent));
    }
    else {
        (0, util_1.log)('event:', sanitizedEvent);
    }
    // determine if this is an async provider based on whether we have an isComplete handler defined.
    // if it is not defined, then we are basically ready to return a positive response.
    if (!process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV]) {
        return cfnResponse.submitResponse('SUCCESS', resourceEvent, { noEcho: resourceEvent.NoEcho });
    }
    // ok, we are not complete, so kick off the waiter workflow
    const waiter = {
        stateMachineArn: (0, util_1.getEnv)(consts.WAITER_STATE_MACHINE_ARN_ENV),
        input: JSON.stringify(resourceEvent),
    };
    (0, util_1.log)('starting waiter', {
        stateMachineArn: (0, util_1.getEnv)(consts.WAITER_STATE_MACHINE_ARN_ENV),
    });
    // kick off waiter state machine
    await (0, outbound_1.startExecution)(waiter);
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
    const isCompleteResult = await invokeUserFunction(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, sanitizedRequest, event.ResponseURL);
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
        // This must be the full event, it will be deserialized in `onTimeout` to send the response to CloudFormation
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
}
// invoked when completion retries are exhaused.
async function onTimeout(timeoutEvent) {
    // the timeout event carries the full isComplete request (including the presigned
    // ResponseURL) in `Cause`, so log the parsed request in sanitized form instead.
    let isCompleteRequest;
    try {
        isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage);
    }
    catch (e) {
        // never log `Cause` or the parse error message: both can contain the
        // presigned ResponseURL (JSON.parse quotes part of its input in its message).
        // `Error` is the Step Functions error name (for example `States.Timeout`).
        const isObject = timeoutEvent && typeof timeoutEvent === 'object';
        const stepFunctionsError = isObject && typeof timeoutEvent.Error === 'string' ? timeoutEvent.Error : 'unknown';
        const summary = `timeoutHandler: cannot read the isComplete request from the timeout event (${e?.name ?? 'Error'}); Step Functions error: ${stepFunctionsError}; event keys: ${isObject ? Object.keys(timeoutEvent).join(', ') : typeof timeoutEvent}`;
        (0, util_1.log)(summary);
        throw new Error(summary);
    }
    const sanitizedRequest = { ...isCompleteRequest, ResponseURL: '...' };
    if (isCompleteRequest.NoEcho) {
        (0, util_1.log)('redacted timeoutHandler request', cfnResponse.redactDataFromPayload(sanitizedRequest));
    }
    else {
        (0, util_1.log)('timeoutHandler request', sanitizedRequest);
    }
    await cfnResponse.submitResponse('FAILED', isCompleteRequest, {
        reason: 'Operation timed out',
        noEcho: isCompleteRequest.NoEcho,
    });
}
async function invokeUserFunction(functionArnEnv, sanitizedPayload, responseUrl) {
    const functionArn = (0, util_1.getEnv)(functionArnEnv);
    // an isComplete request carries the Data returned by onEvent
    const loggablePayload = sanitizedPayload.NoEcho
        ? cfnResponse.redactDataFromPayload(sanitizedPayload)
        : sanitizedPayload;
    (0, util_1.log)(`executing user function ${functionArn} with payload`, loggablePayload);
    // transient errors such as timeouts, throttling errors (429), and other
    // errors that aren't caused by a bad request (500 series) are retried
    // automatically by the JavaScript SDK.
    const resp = await (0, outbound_1.invokeFunction)({
        FunctionName: functionArn,
        // Cannot strip 'ResponseURL' here as this would be a breaking change even though the downstream CR doesn't need it
        Payload: JSON.stringify({ ...sanitizedPayload, ResponseURL: responseUrl }),
    });
    // the raw Payload is the user function's return value, which can carry NoEcho
    // Data (as bytes); the parsed value is logged by the caller, redacted when NoEcho
    // is set, so only the invocation metadata is logged here.
    (0, util_1.log)('user function response:', { ...resp, Payload: undefined }, typeof (resp));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvREFBb0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFcEQsNEJBQTRCO0FBRTVCLDREQUE4QztBQUM5QyxpREFBbUM7QUFDbkMseUNBQTREO0FBQzVELGlDQUF1RDtBQVV2RDs7Ozs7Ozs7O0dBU0c7QUFDSCxLQUFLLFVBQVUsT0FBTyxDQUFDLFVBQXVEO0lBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFXLENBQUM7SUFDeEUsSUFBQSxVQUFHLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUV4QyxVQUFVLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixJQUFJLEVBQUcsQ0FBQztJQUVyRSxNQUFNLGFBQWEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFvQixDQUFDO0lBQ25KLElBQUksYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQzFCLElBQUEsVUFBRyxFQUFDLDRCQUE0QixFQUFFLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7U0FBTSxDQUFDO1FBQ04sSUFBQSxVQUFHLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELG9GQUFvRjtJQUNwRixpQ0FBaUM7SUFDakMsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sY0FBYyxHQUFHLEVBQUUsR0FBRyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ2hFLElBQUksYUFBYSxFQUFFLE1B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O0lBQ2pGLENBQUM7QUFDSCxDQUFDO0FBek9ELGlCQUFTO0lBQ1AsQ0FBQyxNQUFNLENBQUMsK0JBQStCLENBQUMsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztJQUMxRSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO0lBQ2hGLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsU0FBUztDQUN0RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQGNka2xhYnMvbm8tdGhyb3ctZGVmYXVsdC1lcnJvciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmltcG9ydCAqIGFzIGNmblJlc3BvbnNlIGZyb20gJy4vY2ZuLXJlc3BvbnNlJztcbmltcG9ydCAqIGFzIGNvbnN0cyBmcm9tICcuL2NvbnN0cyc7XG5pbXBvcnQgeyBpbnZva2VGdW5jdGlvbiwgc3RhcnRFeGVjdXRpb24gfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGdldEVudiwgbG9nLCBwYXJzZUpzb25QYXlsb2FkIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB0eXBlIHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8vIHVzZSBjb25zdHMgZm9yIGhhbmRsZXIgbmFtZXMgdG8gY29tcGlsZXItZW5mb3JjZSB0aGUgY291cGxpbmcgd2l0aCBjb25zdHJ1Y3Rpb24gY29kZS5cbmV4cG9ydCA9IHtcbiAgW2NvbnN0cy5GUkFNRVdPUktfT05fRVZFTlRfSEFORExFUl9OQU1FXTogY2ZuUmVzcG9uc2Uuc2FmZUhhbmRsZXIob25FdmVudCksXG4gIFtjb25zdHMuRlJBTUVXT1JLX0lTX0NPTVBMRVRFX0hBTkRMRVJfTkFNRV06IGNmblJlc3BvbnNlLnNhZmVIYW5kbGVyKGlzQ29tcGxldGUpLFxuICBbY29uc3RzLkZSQU1FV09SS19PTl9USU1FT1VUX0hBTkRMRVJfTkFNRV06IG9uVGltZW91dCxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gcnVudGltZSBlbnRyeXBvaW50IG9mIHRoZSBhc3luYyBjdXN0b20gcmVzb3VyY2UgbGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEFueSBsaWZlY3ljbGUgZXZlbnQgY2hhbmdlcyB0byB0aGUgY3VzdG9tIHJlc291cmNlcyB3aWxsIGludm9rZSB0aGlzIGhhbmRsZXIsIHdoaWNoIHdpbGwsIGluIHR1cm4sXG4gKiBpbnRlcmFjdCB3aXRoIHRoZSB1c2VyLWRlZmluZWQgYG9uRXZlbnRgIGFuZCBgaXNDb21wbGV0ZWAgaGFuZGxlcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGFsd2F5cyBzdWNjZWVkLiBJZiBhbiBlcnJvciBvY2N1cnMsIGl0IGlzIGxvZ2dlZCBidXQgYW4gZXJyb3IgaXMgbm90IHRocm93bi5cbiAqXG4gKiBAcGFyYW0gY2ZuUmVxdWVzdCBUaGUgY2xvdWRmb3JtYXRpb24gY3VzdG9tIHJlc291cmNlIGV2ZW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBvbkV2ZW50KGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3Qgc2FuaXRpemVkUmVxdWVzdCA9IHsgLi4uY2ZuUmVxdWVzdCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0gYXMgY29uc3Q7XG4gIGxvZygnb25FdmVudEhhbmRsZXInLCBzYW5pdGl6ZWRSZXF1ZXN0KTtcblxuICBjZm5SZXF1ZXN0LlJlc291cmNlUHJvcGVydGllcyA9IGNmblJlcXVlc3QuUmVzb3VyY2VQcm9wZXJ0aWVzIHx8IHsgfTtcblxuICBjb25zdCBvbkV2ZW50UmVzdWx0ID0gYXdhaXQgaW52b2tlVXNlckZ1bmN0aW9uKGNvbnN0cy5VU0VSX09OX0VWRU5UX0ZVTkNUSU9OX0FSTl9FTlYsIHNhbml0aXplZFJlcXVlc3QsIGNmblJlcXVlc3QuUmVzcG9uc2VVUkwpIGFzIE9uRXZlbnRSZXNwb25zZTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgb25FdmVudCByZXR1cm5lZDonLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQob25FdmVudFJlc3VsdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnb25FdmVudCByZXR1cm5lZDonLCBvbkV2ZW50UmVzdWx0KTtcbiAgfVxuXG4gIC8vIG1lcmdlIHRoZSByZXF1ZXN0IGFuZCB0aGUgcmVzdWx0IGZyb20gb25FdmVudCB0byBmb3JtIHRoZSBjb21wbGV0ZSByZXNvdXJjZSBldmVudFxuICAvLyB0aGlzIGFsc28gcGVyZm9ybXMgdmFsaWRhdGlvbi5cbiAgY29uc3QgcmVzb3VyY2VFdmVudCA9IGNyZWF0ZVJlc3BvbnNlRXZlbnQoY2ZuUmVxdWVzdCwgb25FdmVudFJlc3VsdCk7XG4gIGNvbnN0IHNhbml0aXplZEV2ZW50ID0geyAuLi5yZXNvdXJjZUV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgZXZlbnQ6JywgY2ZuUmVzcG9uc2UucmVkYWN0RGF0YUZyb21QYXlsb2FkKHNhbml0aXplZEV2ZW50KSk7XG4gIH0gZWxzZSB7XG4gICAgbG9nKCdldmVudDonLCBzYW5pdGl6ZWRFdmVudCk7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgaWYgdGhpcyBpcyBhbiBhc3luYyBwcm92aWRlciBiYXNlZCBvbiB3aGV0aGVyIHdlIGhhdmUgYW4gaXNDb21wbGV0ZSBoYW5kbGVyIGRlZmluZWQuXG4gIC8vIGlmIGl0IGlzIG5vdCBkZWZpbmVkLCB0aGVuIHdlIGFyZSBiYXNpY2FsbHkgcmVhZHkgdG8gcmV0dXJuIGEgcG9zaXRpdmUgcmVzcG9uc2UuXG4gIGlmICghcHJvY2Vzcy5lbnZbY29uc3RzLlVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOX0VOVl0pIHtcbiAgICByZXR1cm4gY2ZuUmVzcG9uc2Uuc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCByZXNvdXJjZUV2ZW50LCB7IG5vRWNobzogcmVzb3VyY2VFdmVudC5Ob0VjaG8gfSk7XG4gIH1cblxuICAvLyBvaywgd2UgYXJlIG5vdCBjb21wbGV0ZSwgc28ga2ljayBvZmYgdGhlIHdhaXRlciB3b3JrZmxvd1xuICBjb25zdCB3YWl0ZXIgPSB7XG4gICAgc3RhdGVNYWNoaW5lQXJuOiBnZXRFbnYoY29uc3RzLldBSVRFUl9TVEFURV9NQUNISU5FX0FSTl9FTlYpLFxuICAgIGlucHV0OiBKU09OLnN0cmluZ2lmeShyZXNvdXJjZUV2ZW50KSxcbiAgfTtcblxuICBsb2coJ3N0YXJ0aW5nIHdhaXRlcicsIHtcbiAgICBzdGF0ZU1hY2hpbmVBcm46IGdldEVudihjb25zdHMuV0FJVEVSX1NUQVRFX01BQ0hJTkVfQVJOX0VOViksXG4gIH0pO1xuXG4gIC8vIGtpY2sgb2ZmIHdhaXRlciBzdGF0ZSBtYWNoaW5lXG4gIGF3YWl0IHN0YXJ0RXhlY3V0aW9uKHdhaXRlcik7XG59XG5cbi8vIGludm9rZWQgYSBmZXcgdGltZXMgdW50aWwgYGNvbXBsZXRlYCBpcyB0cnVlIG9yIHVudGlsIGl0IHRpbWVzIG91dC5cbmFzeW5jIGZ1bmN0aW9uIGlzQ29tcGxldGUoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3QpIHtcbiAgY29uc3Qgc2FuaXRpemVkUmVxdWVzdCA9IHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9IGFzIGNvbnN0O1xuICBpZiAoZXZlbnQ/Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgaXNDb21wbGV0ZSByZXF1ZXN0JywgY2ZuUmVzcG9uc2UucmVkYWN0RGF0YUZyb21QYXlsb2FkKHNhbml0aXplZFJlcXVlc3QpKTtcbiAgfSBlbHNlIHtcbiAgICBsb2coJ2lzQ29tcGxldGUnLCBzYW5pdGl6ZWRSZXF1ZXN0KTtcbiAgfVxuXG4gIGNvbnN0IGlzQ29tcGxldGVSZXN1bHQgPSBhd2FpdCBpbnZva2VVc2VyRnVuY3Rpb24oY29uc3RzLlVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOX0VOViwgc2FuaXRpemVkUmVxdWVzdCwgZXZlbnQuUmVzcG9uc2VVUkwpIGFzIElzQ29tcGxldGVSZXNwb25zZTtcbiAgaWYgKGV2ZW50Py5Ob0VjaG8pIHtcbiAgICBsb2coJ3JlZGFjdGVkIHVzZXIgaXNDb21wbGV0ZSByZXR1cm5lZDonLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQoaXNDb21wbGV0ZVJlc3VsdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygndXNlciBpc0NvbXBsZXRlIHJldHVybmVkOicsIGlzQ29tcGxldGVSZXN1bHQpO1xuICB9XG5cbiAgLy8gaWYgd2UgYXJlIG5vdCBjb21wbGV0ZSwgcmV0dXJuIGZhbHNlLCBhbmQgZG9uJ3Qgc2VuZCBhIHJlc3BvbnNlIGJhY2suXG4gIGlmICghaXNDb21wbGV0ZVJlc3VsdC5Jc0NvbXBsZXRlKSB7XG4gICAgaWYgKGlzQ29tcGxldGVSZXN1bHQuRGF0YSAmJiBPYmplY3Qua2V5cyhpc0NvbXBsZXRlUmVzdWx0LkRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJEYXRhXCIgaXMgbm90IGFsbG93ZWQgaWYgXCJJc0NvbXBsZXRlXCIgaXMgXCJGYWxzZVwiJyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBtdXN0IGJlIHRoZSBmdWxsIGV2ZW50LCBpdCB3aWxsIGJlIGRlc2VyaWFsaXplZCBpbiBgb25UaW1lb3V0YCB0byBzZW5kIHRoZSByZXNwb25zZSB0byBDbG91ZEZvcm1hdGlvblxuICAgIHRocm93IG5ldyBjZm5SZXNwb25zZS5SZXRyeShKU09OLnN0cmluZ2lmeShldmVudCkpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgLi4uZXZlbnQsXG4gICAgLi4uaXNDb21wbGV0ZVJlc3VsdCxcbiAgICBEYXRhOiB7XG4gICAgICAuLi5ldmVudC5EYXRhLFxuICAgICAgLi4uaXNDb21wbGV0ZVJlc3VsdC5EYXRhLFxuICAgIH0sXG4gIH07XG5cbiAgYXdhaXQgY2ZuUmVzcG9uc2Uuc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCByZXNwb25zZSwgeyBub0VjaG86IGV2ZW50Lk5vRWNobyB9KTtcbn1cblxuLy8gaW52b2tlZCB3aGVuIGNvbXBsZXRpb24gcmV0cmllcyBhcmUgZXhoYXVzZWQuXG5hc3luYyBmdW5jdGlvbiBvblRpbWVvdXQodGltZW91dEV2ZW50OiBhbnkpIHtcbiAgLy8gdGhlIHRpbWVvdXQgZXZlbnQgY2FycmllcyB0aGUgZnVsbCBpc0NvbXBsZXRlIHJlcXVlc3QgKGluY2x1ZGluZyB0aGUgcHJlc2lnbmVkXG4gIC8vIFJlc3BvbnNlVVJMKSBpbiBgQ2F1c2VgLCBzbyBsb2cgdGhlIHBhcnNlZCByZXF1ZXN0IGluIHNhbml0aXplZCBmb3JtIGluc3RlYWQuXG4gIGxldCBpc0NvbXBsZXRlUmVxdWVzdDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5Jc0NvbXBsZXRlUmVxdWVzdDtcbiAgdHJ5IHtcbiAgICBpc0NvbXBsZXRlUmVxdWVzdCA9IEpTT04ucGFyc2UoSlNPTi5wYXJzZSh0aW1lb3V0RXZlbnQuQ2F1c2UpLmVycm9yTWVzc2FnZSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIC8vIG5ldmVyIGxvZyBgQ2F1c2VgIG9yIHRoZSBwYXJzZSBlcnJvciBtZXNzYWdlOiBib3RoIGNhbiBjb250YWluIHRoZVxuICAgIC8vIHByZXNpZ25lZCBSZXNwb25zZVVSTCAoSlNPTi5wYXJzZSBxdW90ZXMgcGFydCBvZiBpdHMgaW5wdXQgaW4gaXRzIG1lc3NhZ2UpLlxuICAgIC8vIGBFcnJvcmAgaXMgdGhlIFN0ZXAgRnVuY3Rpb25zIGVycm9yIG5hbWUgKGZvciBleGFtcGxlIGBTdGF0ZXMuVGltZW91dGApLlxuICAgIGNvbnN0IGlzT2JqZWN0ID0gdGltZW91dEV2ZW50ICYmIHR5cGVvZiB0aW1lb3V0RXZlbnQgPT09ICdvYmplY3QnO1xuICAgIGNvbnN0IHN0ZXBGdW5jdGlvbnNFcnJvciA9IGlzT2JqZWN0ICYmIHR5cGVvZiB0aW1lb3V0RXZlbnQuRXJyb3IgPT09ICdzdHJpbmcnID8gdGltZW91dEV2ZW50LkVycm9yIDogJ3Vua25vd24nO1xuICAgIGNvbnN0IHN1bW1hcnkgPSBgdGltZW91dEhhbmRsZXI6IGNhbm5vdCByZWFkIHRoZSBpc0NvbXBsZXRlIHJlcXVlc3QgZnJvbSB0aGUgdGltZW91dCBldmVudCAoJHtlPy5uYW1lID8/ICdFcnJvcid9KTsgU3RlcCBGdW5jdGlvbnMgZXJyb3I6ICR7c3RlcEZ1bmN0aW9uc0Vycm9yfTsgZXZlbnQga2V5czogJHtpc09iamVjdCA/IE9iamVjdC5rZXlzKHRpbWVvdXRFdmVudCkuam9pbignLCAnKSA6IHR5cGVvZiB0aW1lb3V0RXZlbnR9YDtcbiAgICBsb2coc3VtbWFyeSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKHN1bW1hcnkpO1xuICB9XG4gIGNvbnN0IHNhbml0aXplZFJlcXVlc3QgPSB7IC4uLmlzQ29tcGxldGVSZXF1ZXN0LCBSZXNwb25zZVVSTDogJy4uLicgfTtcbiAgaWYgKGlzQ29tcGxldGVSZXF1ZXN0Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgdGltZW91dEhhbmRsZXIgcmVxdWVzdCcsIGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRSZXF1ZXN0KSk7XG4gIH0gZWxzZSB7XG4gICAgbG9nKCd0aW1lb3V0SGFuZGxlciByZXF1ZXN0Jywgc2FuaXRpemVkUmVxdWVzdCk7XG4gIH1cbiAgYXdhaXQgY2ZuUmVzcG9uc2Uuc3VibWl0UmVzcG9uc2UoJ0ZBSUxFRCcsIGlzQ29tcGxldGVSZXF1ZXN0LCB7XG4gICAgcmVhc29uOiAnT3BlcmF0aW9uIHRpbWVkIG91dCcsXG4gICAgbm9FY2hvOiBpc0NvbXBsZXRlUmVxdWVzdC5Ob0VjaG8sXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbnZva2VVc2VyRnVuY3Rpb248QSBleHRlbmRzIHsgUmVzcG9uc2VVUkw6ICcuLi4nIH0+KGZ1bmN0aW9uQXJuRW52OiBzdHJpbmcsIHNhbml0aXplZFBheWxvYWQ6IEEsIHJlc3BvbnNlVXJsOiBzdHJpbmcpIHtcbiAgY29uc3QgZnVuY3Rpb25Bcm4gPSBnZXRFbnYoZnVuY3Rpb25Bcm5FbnYpO1xuICAvLyBhbiBpc0NvbXBsZXRlIHJlcXVlc3QgY2FycmllcyB0aGUgRGF0YSByZXR1cm5lZCBieSBvbkV2ZW50XG4gIGNvbnN0IGxvZ2dhYmxlUGF5bG9hZCA9IChzYW5pdGl6ZWRQYXlsb2FkIGFzIHsgTm9FY2hvPzogYm9vbGVhbiB9KS5Ob0VjaG9cbiAgICA/IGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRQYXlsb2FkIGFzIE9uRXZlbnRSZXNwb25zZSlcbiAgICA6IHNhbml0aXplZFBheWxvYWQ7XG4gIGxvZyhgZXhlY3V0aW5nIHVzZXIgZnVuY3Rpb24gJHtmdW5jdGlvbkFybn0gd2l0aCBwYXlsb2FkYCwgbG9nZ2FibGVQYXlsb2FkKTtcblxuICAvLyB0cmFuc2llbnQgZXJyb3JzIHN1Y2ggYXMgdGltZW91dHMsIHRocm90dGxpbmcgZXJyb3JzICg0MjkpLCBhbmQgb3RoZXJcbiAgLy8gZXJyb3JzIHRoYXQgYXJlbid0IGNhdXNlZCBieSBhIGJhZCByZXF1ZXN0ICg1MDAgc2VyaWVzKSBhcmUgcmV0cmllZFxuICAvLyBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBKYXZhU2NyaXB0IFNESy5cbiAgY29uc3QgcmVzcCA9IGF3YWl0IGludm9rZUZ1bmN0aW9uKHtcbiAgICBGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uQXJuLFxuXG4gICAgLy8gQ2Fubm90IHN0cmlwICdSZXNwb25zZVVSTCcgaGVyZSBhcyB0aGlzIHdvdWxkIGJlIGEgYnJlYWtpbmcgY2hhbmdlIGV2ZW4gdGhvdWdoIHRoZSBkb3duc3RyZWFtIENSIGRvZXNuJ3QgbmVlZCBpdFxuICAgIFBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHsgLi4uc2FuaXRpemVkUGF5bG9hZCwgUmVzcG9uc2VVUkw6IHJlc3BvbnNlVXJsIH0pLFxuICB9KTtcblxuICAvLyB0aGUgcmF3IFBheWxvYWQgaXMgdGhlIHVzZXIgZnVuY3Rpb24ncyByZXR1cm4gdmFsdWUsIHdoaWNoIGNhbiBjYXJyeSBOb0VjaG9cbiAgLy8gRGF0YSAoYXMgYnl0ZXMpOyB0aGUgcGFyc2VkIHZhbHVlIGlzIGxvZ2dlZCBieSB0aGUgY2FsbGVyLCByZWRhY3RlZCB3aGVuIE5vRWNob1xuICAvLyBpcyBzZXQsIHNvIG9ubHkgdGhlIGludm9jYXRpb24gbWV0YWRhdGEgaXMgbG9nZ2VkIGhlcmUuXG4gIGxvZygndXNlciBmdW5jdGlvbiByZXNwb25zZTonLCB7IC4uLnJlc3AsIFBheWxvYWQ6IHVuZGVmaW5lZCB9LCB0eXBlb2YocmVzcCkpO1xuXG4gIC8vIFBhcnNlSnNvblBheWxvYWQgaXMgdmVyeSBkZWZlbnNpdmUuIEl0IHNob3VsZCBub3QgYmUgcG9zc2libGUgZm9yIGBQYXlsb2FkYFxuICAvLyB0byBiZSBhbnl0aGluZyBvdGhlciB0aGFuIGEgSlNPTiBlbmNvZGVkIHN0cmluZyAob3IgaW50YXJyYXkpLiBTb21ldGhpbmcgd2VpcmQgaXNcbiAgLy8gZ29pbmcgb24gaWYgdGhhdCBoYXBwZW5zLiBTdGlsbCwgd2Ugc2hvdWxkIGRvIG91ciBiZXN0IHRvIHN1cnZpdmUgaXQuXG4gIGNvbnN0IGpzb25QYXlsb2FkID0gcGFyc2VKc29uUGF5bG9hZChyZXNwLlBheWxvYWQpO1xuICBpZiAocmVzcC5GdW5jdGlvbkVycm9yKSB7XG4gICAgbG9nKCd1c2VyIGZ1bmN0aW9uIHRocmV3IGFuIGVycm9yOicsIHJlc3AuRnVuY3Rpb25FcnJvcik7XG5cbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBqc29uUGF5bG9hZC5lcnJvck1lc3NhZ2UgfHwgJ2Vycm9yJztcblxuICAgIC8vIHBhcnNlIGZ1bmN0aW9uIG5hbWUgZnJvbSBhcm5cbiAgICAvLyBhcm46JHtQYXJ0aXRpb259OmxhbWJkYToke1JlZ2lvbn06JHtBY2NvdW50fTpmdW5jdGlvbjoke0Z1bmN0aW9uTmFtZX1cbiAgICBjb25zdCBhcm4gPSBmdW5jdGlvbkFybi5zcGxpdCgnOicpO1xuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGFyblthcm4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyBhcHBlbmQgYSByZWZlcmVuY2UgdG8gdGhlIGxvZyBncm91cC5cbiAgICBjb25zdCBtZXNzYWdlID0gW1xuICAgICAgZXJyb3JNZXNzYWdlLFxuICAgICAgJycsXG4gICAgICBgTG9nczogL2F3cy9sYW1iZGEvJHtmdW5jdGlvbk5hbWV9YCwgLy8gY2xvdWR3YXRjaCBsb2cgZ3JvdXBcbiAgICAgICcnLFxuICAgIF0uam9pbignXFxuJyk7XG5cbiAgICBjb25zdCBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuXG4gICAgLy8gdGhlIG91dHB1dCB0aGF0IGdvZXMgdG8gQ0ZOIGlzIHdoYXQncyBpbiBgc3RhY2tgLCBub3QgdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIHJlbW90ZSB0cmFjZSwgY29uc3RydWN0IGEgbmljZSBtZXNzYWdlIHdpdGggbG9nIGdyb3VwIGluZm9ybWF0aW9uXG4gICAgaWYgKGpzb25QYXlsb2FkLnRyYWNlKSB7XG4gICAgICAvLyBza2lwIGZpcnN0IHRyYWNlIGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBtZXNzYWdlXG4gICAgICBlLnN0YWNrID0gW21lc3NhZ2UsIC4uLmpzb25QYXlsb2FkLnRyYWNlLnNsaWNlKDEpXS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgcmV0dXJuIGpzb25QYXlsb2FkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXNwb25zZUV2ZW50KGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIG9uRXZlbnRSZXN1bHQ6IE9uRXZlbnRSZXNwb25zZSk6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3Qge1xuICAvL1xuICAvLyB2YWxpZGF0ZSB0aGF0IG9uRXZlbnRSZXN1bHQgYWx3YXlzIGluY2x1ZGVzIGEgUGh5c2ljYWxSZXNvdXJjZUlkXG5cbiAgb25FdmVudFJlc3VsdCA9IG9uRXZlbnRSZXN1bHQgfHwgeyB9O1xuXG4gIC8vIGlmIHBoeXNpY2FsIElEIGlzIG5vdCByZXR1cm5lZCwgd2UgaGF2ZSBzb21lIGRlZmF1bHRzIGZvciB5b3UgYmFzZWRcbiAgLy8gb24gdGhlIHJlcXVlc3QgdHlwZS5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gb25FdmVudFJlc3VsdC5QaHlzaWNhbFJlc291cmNlSWQgfHwgZGVmYXVsdFBoeXNpY2FsUmVzb3VyY2VJZChjZm5SZXF1ZXN0KTtcblxuICAvLyBpZiB3ZSBhcmUgaW4gREVMRVRFIGFuZCBwaHlzaWNhbCBJRCB3YXMgY2hhbmdlZCwgaXQncyBhbiBlcnJvci5cbiAgaWYgKGNmblJlcXVlc3QuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIHBoeXNpY2FsUmVzb3VyY2VJZCAhPT0gY2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYERFTEVURTogY2Fubm90IGNoYW5nZSB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgZnJvbSBcIiR7Y2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWR9XCIgdG8gXCIke29uRXZlbnRSZXN1bHQuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIGR1cmluZyBkZWxldGlvbmApO1xuICB9XG5cbiAgLy8gaWYgd2UgYXJlIGluIFVQREFURSBhbmQgcGh5c2ljYWwgSUQgd2FzIGNoYW5nZWQsIGl0J3MgYSByZXBsYWNlbWVudCAoanVzdCBsb2cpXG4gIGlmIChjZm5SZXF1ZXN0LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJyAmJiBwaHlzaWNhbFJlc291cmNlSWQgIT09IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgbG9nKGBVUERBVEU6IGNoYW5naW5nIHBoeXNpY2FsIHJlc291cmNlIElEIGZyb20gXCIke2NmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIHRvIFwiJHtvbkV2ZW50UmVzdWx0LlBoeXNpY2FsUmVzb3VyY2VJZH1cImApO1xuICB9XG5cbiAgLy8gbWVyZ2UgcmVxdWVzdCBldmVudCBhbmQgcmVzdWx0IGV2ZW50IChyZXN1bHQgcHJldmFpbHMpLlxuICByZXR1cm4ge1xuICAgIC4uLmNmblJlcXVlc3QsXG4gICAgLi4ub25FdmVudFJlc3VsdCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgfTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZWZhdWx0IHBoeXNpY2FsIHJlc291cmNlIElEIGJhc2VkIGluIGNhc2UgdXNlciBoYW5kbGVyIGRpZFxuICogbm90IHJldHVybiBhIFBoeXNpY2FsUmVzb3VyY2VJZC5cbiAqXG4gKiBGb3IgXCJDUkVBVEVcIiwgaXQgdXNlcyB0aGUgUmVxdWVzdElkLlxuICogRm9yIFwiVVBEQVRFXCIgYW5kIFwiREVMRVRFXCIgYW5kIHJldHVybnMgdGhlIGN1cnJlbnQgUGh5c2ljYWxSZXNvdXJjZUlkICh0aGUgb25lIHByb3ZpZGVkIGluIGBldmVudGApLlxuICovXG5mdW5jdGlvbiBkZWZhdWx0UGh5c2ljYWxSZXNvdXJjZUlkKHJlcTogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCk6IHN0cmluZyB7XG4gIHN3aXRjaCAocmVxLlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIHJldHVybiByZXEuUmVxdWVzdElkO1xuXG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIHJlcS5QaHlzaWNhbFJlc291cmNlSWQ7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFwiUmVxdWVzdFR5cGVcIiBpbiByZXF1ZXN0IFwiJHtKU09OLnN0cmluZ2lmeShyZXEpfVwiYCk7XG4gIH1cbn1cbiJdfQ==