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
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvREFBb0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFcEQsNEJBQTRCO0FBRTVCLDREQUE4QztBQUM5QyxpREFBbUM7QUFDbkMseUNBQTREO0FBQzVELGlDQUF1RDtBQVV2RDs7Ozs7Ozs7O0dBU0c7QUFDSCxLQUFLLFVBQVUsT0FBTyxDQUFDLFVBQXVEO0lBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFXLENBQUM7SUFDeEUsSUFBQSxVQUFHLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUV4QyxVQUFVLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixJQUFJLEVBQUcsQ0FBQztJQUVyRSxNQUFNLGFBQWEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFvQixDQUFDO0lBQ25KLElBQUksYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQzFCLElBQUEsVUFBRyxFQUFDLDRCQUE0QixFQUFFLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7U0FBTSxDQUFDO1FBQ04sSUFBQSxVQUFHLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELG9GQUFvRjtJQUNwRixpQ0FBaUM7SUFDakMsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sY0FBYyxHQUFHLEVBQUUsR0FBRyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ2hFLElBQUksYUFBYSxFQUFFLE1B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bnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQGNka2xhYnMvbm8tdGhyb3ctZGVmYXVsdC1lcnJvciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmltcG9ydCAqIGFzIGNmblJlc3BvbnNlIGZyb20gJy4vY2ZuLXJlc3BvbnNlJztcbmltcG9ydCAqIGFzIGNvbnN0cyBmcm9tICcuL2NvbnN0cyc7XG5pbXBvcnQgeyBpbnZva2VGdW5jdGlvbiwgc3RhcnRFeGVjdXRpb24gfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGdldEVudiwgbG9nLCBwYXJzZUpzb25QYXlsb2FkIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB0eXBlIHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8vIHVzZSBjb25zdHMgZm9yIGhhbmRsZXIgbmFtZXMgdG8gY29tcGlsZXItZW5mb3JjZSB0aGUgY291cGxpbmcgd2l0aCBjb25zdHJ1Y3Rpb24gY29kZS5cbmV4cG9ydCA9IHtcbiAgW2NvbnN0cy5GUkFNRVdPUktfT05fRVZFTlRfSEFORExFUl9OQU1FXTogY2ZuUmVzcG9uc2Uuc2FmZUhhbmRsZXIob25FdmVudCksXG4gIFtjb25zdHMuRlJBTUVXT1JLX0lTX0NPTVBMRVRFX0hBTkRMRVJfTkFNRV06IGNmblJlc3BvbnNlLnNhZmVIYW5kbGVyKGlzQ29tcGxldGUpLFxuICBbY29uc3RzLkZSQU1FV09SS19PTl9USU1FT1VUX0hBTkRMRVJfTkFNRV06IG9uVGltZW91dCxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gcnVudGltZSBlbnRyeXBvaW50IG9mIHRoZSBhc3luYyBjdXN0b20gcmVzb3VyY2UgbGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEFueSBsaWZlY3ljbGUgZXZlbnQgY2hhbmdlcyB0byB0aGUgY3VzdG9tIHJlc291cmNlcyB3aWxsIGludm9rZSB0aGlzIGhhbmRsZXIsIHdoaWNoIHdpbGwsIGluIHR1cm4sXG4gKiBpbnRlcmFjdCB3aXRoIHRoZSB1c2VyLWRlZmluZWQgYG9uRXZlbnRgIGFuZCBgaXNDb21wbGV0ZWAgaGFuZGxlcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGFsd2F5cyBzdWNjZWVkLiBJZiBhbiBlcnJvciBvY2N1cnMsIGl0IGlzIGxvZ2dlZCBidXQgYW4gZXJyb3IgaXMgbm90IHRocm93bi5cbiAqXG4gKiBAcGFyYW0gY2ZuUmVxdWVzdCBUaGUgY2xvdWRmb3JtYXRpb24gY3VzdG9tIHJlc291cmNlIGV2ZW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBvbkV2ZW50KGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3Qgc2FuaXRpemVkUmVxdWVzdCA9IHsgLi4uY2ZuUmVxdWVzdCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0gYXMgY29uc3Q7XG4gIGxvZygnb25FdmVudEhhbmRsZXInLCBzYW5pdGl6ZWRSZXF1ZXN0KTtcblxuICBjZm5SZXF1ZXN0LlJlc291cmNlUHJvcGVydGllcyA9IGNmblJlcXVlc3QuUmVzb3VyY2VQcm9wZXJ0aWVzIHx8IHsgfTtcblxuICBjb25zdCBvbkV2ZW50UmVzdWx0ID0gYXdhaXQgaW52b2tlVXNlckZ1bmN0aW9uKGNvbnN0cy5VU0VSX09OX0VWRU5UX0ZVTkNUSU9OX0FSTl9FTlYsIHNhbml0aXplZFJlcXVlc3QsIGNmblJlcXVlc3QuUmVzcG9uc2VVUkwpIGFzIE9uRXZlbnRSZXNwb25zZTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVkYWN0ZWQgb25FdmVudCByZXR1cm5lZDonLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQob25FdmVudFJlc3VsdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnb25FdmVudCByZXR1cm5lZDonLCBvbkV2ZW50UmVzdWx0KTtcbiAgfVxuXG4gIC8vIG1lcmdlIHRoZSByZXF1ZXN0IGFuZCB0aGUgcmVzdWx0IGZyb20gb25FdmVudCB0byBmb3JtIHRoZSBjb21wbGV0ZSByZXNvdXJjZSBldmVudFxuICAvLyB0aGlzIGFsc28gcGVyZm9ybXMgdmFsaWRhdGlvbi5cbiAgY29uc3QgcmVzb3VyY2VFdmVudCA9IGNyZWF0ZVJlc3BvbnNlRXZlbnQoY2ZuUmVxdWVzdCwgb25FdmVudFJlc3VsdCk7XG4gIGNvbnN0IHNhbml0aXplZEV2ZW50ID0geyAuLi5yZXNvdXJjZUV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfTtcbiAgaWYgKG9uRXZlbnRSZXN1bHQ/Lk5vRWNobykge1xuICAgIGxvZygncmVhZGFjdGVkIGV2ZW50OicsIGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRFdmVudCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnZXZlbnQ6Jywgc2FuaXRpemVkRXZlbnQpO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGlmIHRoaXMgaXMgYW4gYXN5bmMgcHJvdmlkZXIgYmFzZWQgb24gd2hldGhlciB3ZSBoYXZlIGFuIGlzQ29tcGxldGUgaGFuZGxlciBkZWZpbmVkLlxuICAvLyBpZiBpdCBpcyBub3QgZGVmaW5lZCwgdGhlbiB3ZSBhcmUgYmFzaWNhbGx5IHJlYWR5IHRvIHJldHVybiBhIHBvc2l0aXZlIHJlc3BvbnNlLlxuICBpZiAoIXByb2Nlc3MuZW52W2NvbnN0cy5VU0VSX0lTX0NPTVBMRVRFX0ZVTkNUSU9OX0FSTl9FTlZdKSB7XG4gICAgcmV0dXJuIGNmblJlc3BvbnNlLnN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgcmVzb3VyY2VFdmVudCwgeyBub0VjaG86IHJlc291cmNlRXZlbnQuTm9FY2hvIH0pO1xuICB9XG5cbiAgLy8gb2ssIHdlIGFyZSBub3QgY29tcGxldGUsIHNvIGtpY2sgb2ZmIHRoZSB3YWl0ZXIgd29ya2Zsb3dcbiAgY29uc3Qgd2FpdGVyID0ge1xuICAgIHN0YXRlTWFjaGluZUFybjogZ2V0RW52KGNvbnN0cy5XQUlURVJfU1RBVEVfTUFDSElORV9BUk5fRU5WKSxcbiAgICBpbnB1dDogSlNPTi5zdHJpbmdpZnkocmVzb3VyY2VFdmVudCksXG4gIH07XG5cbiAgbG9nKCdzdGFydGluZyB3YWl0ZXInLCB7XG4gICAgc3RhdGVNYWNoaW5lQXJuOiBnZXRFbnYoY29uc3RzLldBSVRFUl9TVEFURV9NQUNISU5FX0FSTl9FTlYpLFxuICB9KTtcblxuICAvLyBraWNrIG9mZiB3YWl0ZXIgc3RhdGUgbWFjaGluZVxuICBhd2FpdCBzdGFydEV4ZWN1dGlvbih3YWl0ZXIpO1xufVxuXG4vLyBpbnZva2VkIGEgZmV3IHRpbWVzIHVudGlsIGBjb21wbGV0ZWAgaXMgdHJ1ZSBvciB1bnRpbCBpdCB0aW1lcyBvdXQuXG5hc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlKGV2ZW50OiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLklzQ29tcGxldGVSZXF1ZXN0KSB7XG4gIGNvbnN0IHNhbml0aXplZFJlcXVlc3QgPSB7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSBhcyBjb25zdDtcbiAgaWYgKGV2ZW50Py5Ob0VjaG8pIHtcbiAgICBsb2coJ3JlZGFjdGVkIGlzQ29tcGxldGUgcmVxdWVzdCcsIGNmblJlc3BvbnNlLnJlZGFjdERhdGFGcm9tUGF5bG9hZChzYW5pdGl6ZWRSZXF1ZXN0KSk7XG4gIH0gZWxzZSB7XG4gICAgbG9nKCdpc0NvbXBsZXRlJywgc2FuaXRpemVkUmVxdWVzdCk7XG4gIH1cblxuICBjb25zdCBpc0NvbXBsZXRlUmVzdWx0ID0gYXdhaXQgaW52b2tlVXNlckZ1bmN0aW9uKGNvbnN0cy5VU0VSX0lTX0NPTVBMRVRFX0ZVTkNUSU9OX0FSTl9FTlYsIHNhbml0aXplZFJlcXVlc3QsIGV2ZW50LlJlc3BvbnNlVVJMKSBhcyBJc0NvbXBsZXRlUmVzcG9uc2U7XG4gIGlmIChldmVudD8uTm9FY2hvKSB7XG4gICAgbG9nKCdyZWRhY3RlZCB1c2VyIGlzQ29tcGxldGUgcmV0dXJuZWQ6JywgY2ZuUmVzcG9uc2UucmVkYWN0RGF0YUZyb21QYXlsb2FkKGlzQ29tcGxldGVSZXN1bHQpKTtcbiAgfSBlbHNlIHtcbiAgICBsb2coJ3VzZXIgaXNDb21wbGV0ZSByZXR1cm5lZDonLCBpc0NvbXBsZXRlUmVzdWx0KTtcbiAgfVxuXG4gIC8vIGlmIHdlIGFyZSBub3QgY29tcGxldGUsIHJldHVybiBmYWxzZSwgYW5kIGRvbid0IHNlbmQgYSByZXNwb25zZSBiYWNrLlxuICBpZiAoIWlzQ29tcGxldGVSZXN1bHQuSXNDb21wbGV0ZSkge1xuICAgIGlmIChpc0NvbXBsZXRlUmVzdWx0LkRhdGEgJiYgT2JqZWN0LmtleXMoaXNDb21wbGV0ZVJlc3VsdC5EYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiRGF0YVwiIGlzIG5vdCBhbGxvd2VkIGlmIFwiSXNDb21wbGV0ZVwiIGlzIFwiRmFsc2VcIicpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgbXVzdCBiZSB0aGUgZnVsbCBldmVudCwgaXQgd2lsbCBiZSBkZXNlcmlhbGl6ZWQgaW4gYG9uVGltZW91dGAgdG8gc2VuZCB0aGUgcmVzcG9uc2UgdG8gQ2xvdWRGb3JtYXRpb25cbiAgICB0aHJvdyBuZXcgY2ZuUmVzcG9uc2UuUmV0cnkoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgIC4uLmV2ZW50LFxuICAgIC4uLmlzQ29tcGxldGVSZXN1bHQsXG4gICAgRGF0YToge1xuICAgICAgLi4uZXZlbnQuRGF0YSxcbiAgICAgIC4uLmlzQ29tcGxldGVSZXN1bHQuRGF0YSxcbiAgICB9LFxuICB9O1xuXG4gIGF3YWl0IGNmblJlc3BvbnNlLnN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgcmVzcG9uc2UsIHsgbm9FY2hvOiBldmVudC5Ob0VjaG8gfSk7XG59XG5cbi8vIGludm9rZWQgd2hlbiBjb21wbGV0aW9uIHJldHJpZXMgYXJlIGV4aGF1c2VkLlxuYXN5bmMgZnVuY3Rpb24gb25UaW1lb3V0KHRpbWVvdXRFdmVudDogYW55KSB7XG4gIC8vIHRoZSB0aW1lb3V0IGV2ZW50IGNhcnJpZXMgdGhlIGZ1bGwgaXNDb21wbGV0ZSByZXF1ZXN0IChpbmNsdWRpbmcgdGhlIHByZXNpZ25lZFxuICAvLyBSZXNwb25zZVVSTCkgaW4gYENhdXNlYCwgc28gbG9nIHRoZSBwYXJzZWQgcmVxdWVzdCBpbiBzYW5pdGl6ZWQgZm9ybSBpbnN0ZWFkLlxuICBsZXQgaXNDb21wbGV0ZVJlcXVlc3Q6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3Q7XG4gIHRyeSB7XG4gICAgaXNDb21wbGV0ZVJlcXVlc3QgPSBKU09OLnBhcnNlKEpTT04ucGFyc2UodGltZW91dEV2ZW50LkNhdXNlKS5lcnJvck1lc3NhZ2UpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAvLyBuZXZlciBsb2cgYENhdXNlYCBvciB0aGUgcGFyc2UgZXJyb3IgbWVzc2FnZTogYm90aCBjYW4gY29udGFpbiB0aGVcbiAgICAvLyBwcmVzaWduZWQgUmVzcG9uc2VVUkwgKEpTT04ucGFyc2UgcXVvdGVzIHBhcnQgb2YgaXRzIGlucHV0IGluIGl0cyBtZXNzYWdlKS5cbiAgICAvLyBgRXJyb3JgIGlzIHRoZSBTdGVwIEZ1bmN0aW9ucyBlcnJvciBuYW1lIChmb3IgZXhhbXBsZSBgU3RhdGVzLlRpbWVvdXRgKS5cbiAgICBjb25zdCBpc09iamVjdCA9IHRpbWVvdXRFdmVudCAmJiB0eXBlb2YgdGltZW91dEV2ZW50ID09PSAnb2JqZWN0JztcbiAgICBjb25zdCBzdGVwRnVuY3Rpb25zRXJyb3IgPSBpc09iamVjdCAmJiB0eXBlb2YgdGltZW91dEV2ZW50LkVycm9yID09PSAnc3RyaW5nJyA/IHRpbWVvdXRFdmVudC5FcnJvciA6ICd1bmtub3duJztcbiAgICBjb25zdCBzdW1tYXJ5ID0gYHRpbWVvdXRIYW5kbGVyOiBjYW5ub3QgcmVhZCB0aGUgaXNDb21wbGV0ZSByZXF1ZXN0IGZyb20gdGhlIHRpbWVvdXQgZXZlbnQgKCR7ZT8ubmFtZSA/PyAnRXJyb3InfSk7IFN0ZXAgRnVuY3Rpb25zIGVycm9yOiAke3N0ZXBGdW5jdGlvbnNFcnJvcn07IGV2ZW50IGtleXM6ICR7aXNPYmplY3QgPyBPYmplY3Qua2V5cyh0aW1lb3V0RXZlbnQpLmpvaW4oJywgJykgOiB0eXBlb2YgdGltZW91dEV2ZW50fWA7XG4gICAgbG9nKHN1bW1hcnkpO1xuICAgIHRocm93IG5ldyBFcnJvcihzdW1tYXJ5KTtcbiAgfVxuICBjb25zdCBzYW5pdGl6ZWRSZXF1ZXN0ID0geyAuLi5pc0NvbXBsZXRlUmVxdWVzdCwgUmVzcG9uc2VVUkw6ICcuLi4nIH07XG4gIGlmIChpc0NvbXBsZXRlUmVxdWVzdC5Ob0VjaG8pIHtcbiAgICBsb2coJ3JlZGFjdGVkIHRpbWVvdXRIYW5kbGVyIHJlcXVlc3QnLCBjZm5SZXNwb25zZS5yZWRhY3REYXRhRnJvbVBheWxvYWQoc2FuaXRpemVkUmVxdWVzdCkpO1xuICB9IGVsc2Uge1xuICAgIGxvZygndGltZW91dEhhbmRsZXIgcmVxdWVzdCcsIHNhbml0aXplZFJlcXVlc3QpO1xuICB9XG4gIGF3YWl0IGNmblJlc3BvbnNlLnN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCBpc0NvbXBsZXRlUmVxdWVzdCwge1xuICAgIHJlYXNvbjogJ09wZXJhdGlvbiB0aW1lZCBvdXQnLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW52b2tlVXNlckZ1bmN0aW9uPEEgZXh0ZW5kcyB7IFJlc3BvbnNlVVJMOiAnLi4uJyB9PihmdW5jdGlvbkFybkVudjogc3RyaW5nLCBzYW5pdGl6ZWRQYXlsb2FkOiBBLCByZXNwb25zZVVybDogc3RyaW5nKSB7XG4gIGNvbnN0IGZ1bmN0aW9uQXJuID0gZ2V0RW52KGZ1bmN0aW9uQXJuRW52KTtcbiAgbG9nKGBleGVjdXRpbmcgdXNlciBmdW5jdGlvbiAke2Z1bmN0aW9uQXJufSB3aXRoIHBheWxvYWRgLCBzYW5pdGl6ZWRQYXlsb2FkKTtcblxuICAvLyB0cmFuc2llbnQgZXJyb3JzIHN1Y2ggYXMgdGltZW91dHMsIHRocm90dGxpbmcgZXJyb3JzICg0MjkpLCBhbmQgb3RoZXJcbiAgLy8gZXJyb3JzIHRoYXQgYXJlbid0IGNhdXNlZCBieSBhIGJhZCByZXF1ZXN0ICg1MDAgc2VyaWVzKSBhcmUgcmV0cmllZFxuICAvLyBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBKYXZhU2NyaXB0IFNESy5cbiAgY29uc3QgcmVzcCA9IGF3YWl0IGludm9rZUZ1bmN0aW9uKHtcbiAgICBGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uQXJuLFxuXG4gICAgLy8gQ2Fubm90IHN0cmlwICdSZXNwb25zZVVSTCcgaGVyZSBhcyB0aGlzIHdvdWxkIGJlIGEgYnJlYWtpbmcgY2hhbmdlIGV2ZW4gdGhvdWdoIHRoZSBkb3duc3RyZWFtIENSIGRvZXNuJ3QgbmVlZCBpdFxuICAgIFBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHsgLi4uc2FuaXRpemVkUGF5bG9hZCwgUmVzcG9uc2VVUkw6IHJlc3BvbnNlVXJsIH0pLFxuICB9KTtcblxuICBsb2coJ3VzZXIgZnVuY3Rpb24gcmVzcG9uc2U6JywgcmVzcCwgdHlwZW9mKHJlc3ApKTtcblxuICAvLyBQYXJzZUpzb25QYXlsb2FkIGlzIHZlcnkgZGVmZW5zaXZlLiBJdCBzaG91bGQgbm90IGJlIHBvc3NpYmxlIGZvciBgUGF5bG9hZGBcbiAgLy8gdG8gYmUgYW55dGhpbmcgb3RoZXIgdGhhbiBhIEpTT04gZW5jb2RlZCBzdHJpbmcgKG9yIGludGFycmF5KS4gU29tZXRoaW5nIHdlaXJkIGlzXG4gIC8vIGdvaW5nIG9uIGlmIHRoYXQgaGFwcGVucy4gU3RpbGwsIHdlIHNob3VsZCBkbyBvdXIgYmVzdCB0byBzdXJ2aXZlIGl0LlxuICBjb25zdCBqc29uUGF5bG9hZCA9IHBhcnNlSnNvblBheWxvYWQocmVzcC5QYXlsb2FkKTtcbiAgaWYgKHJlc3AuRnVuY3Rpb25FcnJvcikge1xuICAgIGxvZygndXNlciBmdW5jdGlvbiB0aHJldyBhbiBlcnJvcjonLCByZXNwLkZ1bmN0aW9uRXJyb3IpO1xuXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0ganNvblBheWxvYWQuZXJyb3JNZXNzYWdlIHx8ICdlcnJvcic7XG5cbiAgICAvLyBwYXJzZSBmdW5jdGlvbiBuYW1lIGZyb20gYXJuXG4gICAgLy8gYXJuOiR7UGFydGl0aW9ufTpsYW1iZGE6JHtSZWdpb259OiR7QWNjb3VudH06ZnVuY3Rpb246JHtGdW5jdGlvbk5hbWV9XG4gICAgY29uc3QgYXJuID0gZnVuY3Rpb25Bcm4uc3BsaXQoJzonKTtcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBhcm5bYXJuLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gYXBwZW5kIGEgcmVmZXJlbmNlIHRvIHRoZSBsb2cgZ3JvdXAuXG4gICAgY29uc3QgbWVzc2FnZSA9IFtcbiAgICAgIGVycm9yTWVzc2FnZSxcbiAgICAgICcnLFxuICAgICAgYExvZ3M6IC9hd3MvbGFtYmRhLyR7ZnVuY3Rpb25OYW1lfWAsIC8vIGNsb3Vkd2F0Y2ggbG9nIGdyb3VwXG4gICAgICAnJyxcbiAgICBdLmpvaW4oJ1xcbicpO1xuXG4gICAgY29uc3QgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcblxuICAgIC8vIHRoZSBvdXRwdXQgdGhhdCBnb2VzIHRvIENGTiBpcyB3aGF0J3MgaW4gYHN0YWNrYCwgbm90IHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIC8vIGlmIHdlIGhhdmUgYSByZW1vdGUgdHJhY2UsIGNvbnN0cnVjdCBhIG5pY2UgbWVzc2FnZSB3aXRoIGxvZyBncm91cCBpbmZvcm1hdGlvblxuICAgIGlmIChqc29uUGF5bG9hZC50cmFjZSkge1xuICAgICAgLy8gc2tpcCBmaXJzdCB0cmFjZSBsaW5lIGJlY2F1c2UgaXQncyB0aGUgbWVzc2FnZVxuICAgICAgZS5zdGFjayA9IFttZXNzYWdlLCAuLi5qc29uUGF5bG9hZC50cmFjZS5zbGljZSgxKV0uam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIHJldHVybiBqc29uUGF5bG9hZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVzcG9uc2VFdmVudChjZm5SZXF1ZXN0OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBvbkV2ZW50UmVzdWx0OiBPbkV2ZW50UmVzcG9uc2UpOiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLklzQ29tcGxldGVSZXF1ZXN0IHtcbiAgLy9cbiAgLy8gdmFsaWRhdGUgdGhhdCBvbkV2ZW50UmVzdWx0IGFsd2F5cyBpbmNsdWRlcyBhIFBoeXNpY2FsUmVzb3VyY2VJZFxuXG4gIG9uRXZlbnRSZXN1bHQgPSBvbkV2ZW50UmVzdWx0IHx8IHsgfTtcblxuICAvLyBpZiBwaHlzaWNhbCBJRCBpcyBub3QgcmV0dXJuZWQsIHdlIGhhdmUgc29tZSBkZWZhdWx0cyBmb3IgeW91IGJhc2VkXG4gIC8vIG9uIHRoZSByZXF1ZXN0IHR5cGUuXG4gIGNvbnN0IHBoeXNpY2FsUmVzb3VyY2VJZCA9IG9uRXZlbnRSZXN1bHQuUGh5c2ljYWxSZXNvdXJjZUlkIHx8IGRlZmF1bHRQaHlzaWNhbFJlc291cmNlSWQoY2ZuUmVxdWVzdCk7XG5cbiAgLy8gaWYgd2UgYXJlIGluIERFTEVURSBhbmQgcGh5c2ljYWwgSUQgd2FzIGNoYW5nZWQsIGl0J3MgYW4gZXJyb3IuXG4gIGlmIChjZm5SZXF1ZXN0LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBwaHlzaWNhbFJlc291cmNlSWQgIT09IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBERUxFVEU6IGNhbm5vdCBjaGFuZ2UgdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGZyb20gXCIke2NmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIHRvIFwiJHtvbkV2ZW50UmVzdWx0LlBoeXNpY2FsUmVzb3VyY2VJZH1cIiBkdXJpbmcgZGVsZXRpb25gKTtcbiAgfVxuXG4gIC8vIGlmIHdlIGFyZSBpbiBVUERBVEUgYW5kIHBoeXNpY2FsIElEIHdhcyBjaGFuZ2VkLCBpdCdzIGEgcmVwbGFjZW1lbnQgKGp1c3QgbG9nKVxuICBpZiAoY2ZuUmVxdWVzdC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgJiYgcGh5c2ljYWxSZXNvdXJjZUlkICE9PSBjZm5SZXF1ZXN0LlBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgIGxvZyhgVVBEQVRFOiBjaGFuZ2luZyBwaHlzaWNhbCByZXNvdXJjZSBJRCBmcm9tIFwiJHtjZm5SZXF1ZXN0LlBoeXNpY2FsUmVzb3VyY2VJZH1cIiB0byBcIiR7b25FdmVudFJlc3VsdC5QaHlzaWNhbFJlc291cmNlSWR9XCJgKTtcbiAgfVxuXG4gIC8vIG1lcmdlIHJlcXVlc3QgZXZlbnQgYW5kIHJlc3VsdCBldmVudCAocmVzdWx0IHByZXZhaWxzKS5cbiAgcmV0dXJuIHtcbiAgICAuLi5jZm5SZXF1ZXN0LFxuICAgIC4uLm9uRXZlbnRSZXN1bHQsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gIH07XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGVmYXVsdCBwaHlzaWNhbCByZXNvdXJjZSBJRCBiYXNlZCBpbiBjYXNlIHVzZXIgaGFuZGxlciBkaWRcbiAqIG5vdCByZXR1cm4gYSBQaHlzaWNhbFJlc291cmNlSWQuXG4gKlxuICogRm9yIFwiQ1JFQVRFXCIsIGl0IHVzZXMgdGhlIFJlcXVlc3RJZC5cbiAqIEZvciBcIlVQREFURVwiIGFuZCBcIkRFTEVURVwiIGFuZCByZXR1cm5zIHRoZSBjdXJyZW50IFBoeXNpY2FsUmVzb3VyY2VJZCAodGhlIG9uZSBwcm92aWRlZCBpbiBgZXZlbnRgKS5cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdFBoeXNpY2FsUmVzb3VyY2VJZChyZXE6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHJlcS5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICByZXR1cm4gcmVxLlJlcXVlc3RJZDtcblxuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiByZXEuUGh5c2ljYWxSZXNvdXJjZUlkO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBcIlJlcXVlc3RUeXBlXCIgaW4gcmVxdWVzdCBcIiR7SlNPTi5zdHJpbmdpZnkocmVxKX1cImApO1xuICB9XG59XG4iXX0=