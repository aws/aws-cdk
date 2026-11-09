"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retry = exports.includeStackTraces = exports.MISSING_PHYSICAL_ID_MARKER = exports.CREATE_FAILED_PHYSICAL_ID_MARKER = void 0;
exports.submitResponse = submitResponse;
exports.safeHandler = safeHandler;
exports.redactDataFromPayload = redactDataFromPayload;
const url = __importStar(require("url"));
const outbound_1 = require("./outbound");
const util_1 = require("./util");
exports.CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED';
exports.MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID';
async function submitResponse(status, event, options = {}) {
    // NoEcho is set if either the caller or the event says so (fail closed). A
    // FAILED response for an isComplete request (submitted by safeHandler) does not
    // pass the option, but the request still carries the Data returned by onEvent.
    // The same value decides both the response body and the log line.
    const noEcho = options.noEcho === true || event.NoEcho === true;
    const json = {
        Status: status,
        Reason: options.reason || status,
        StackId: event.StackId,
        RequestId: event.RequestId,
        PhysicalResourceId: event.PhysicalResourceId || exports.MISSING_PHYSICAL_ID_MARKER,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: noEcho ? true : undefined,
        Data: event.Data,
    };
    const responseBody = JSON.stringify(json);
    const parsedUrl = url.parse(event.ResponseURL);
    const loggingSafeUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/${parsedUrl.pathname}?***`;
    if (noEcho) {
        (0, util_1.log)('submit redacted response to cloudformation', loggingSafeUrl, redactDataFromPayload(json));
    }
    else {
        (0, util_1.log)('submit response to cloudformation', loggingSafeUrl, json);
    }
    const retryOptions = {
        attempts: 5,
        sleep: 1000,
    };
    await (0, util_1.withRetries)(retryOptions, outbound_1.httpRequest)({
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': Buffer.byteLength(responseBody, 'utf8'),
        },
    }, responseBody);
}
exports.includeStackTraces = true; // for unit tests
function safeHandler(block) {
    return async (event) => {
        // ignore DELETE event when the physical resource ID is the marker that
        // indicates that this DELETE is a subsequent DELETE to a failed CREATE
        // operation.
        if (event.RequestType === 'Delete' && event.PhysicalResourceId === exports.CREATE_FAILED_PHYSICAL_ID_MARKER) {
            (0, util_1.log)('ignoring DELETE event caused by a failed CREATE event');
            await submitResponse('SUCCESS', event);
            return;
        }
        try {
            await block(event);
        }
        catch (e) {
            // tell waiter state machine to retry
            if (e instanceof Retry) {
                (0, util_1.log)('retry requested by handler');
                throw e;
            }
            if (!event.PhysicalResourceId) {
                // special case: if CREATE fails, which usually implies, we usually don't
                // have a physical resource id. in this case, the subsequent DELETE
                // operation does not have any meaning, and will likely fail as well. to
                // address this, we use a marker so the provider framework can simply
                // ignore the subsequent DELETE.
                if (event.RequestType === 'Create') {
                    (0, util_1.log)('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
                    event.PhysicalResourceId = exports.CREATE_FAILED_PHYSICAL_ID_MARKER;
                }
                else {
                    // otherwise, if PhysicalResourceId is not specified, something is
                    // terribly wrong because all other events should have an ID.
                    const sanitizedEvent = { ...event, ResponseURL: '...' };
                    (0, util_1.log)(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event.NoEcho === true ? redactDataFromPayload(sanitizedEvent) : sanitizedEvent)}`);
                }
            }
            // this is an actual error, fail the activity altogether and exist.
            await submitResponse('FAILED', event, {
                reason: exports.includeStackTraces ? e.stack : e.message,
            });
        }
    };
}
/**
 * Returns a copy of the payload with every `Data` value replaced, for logging a
 * payload that has `NoEcho` set. The `Data` key names are kept: they are the
 * attribute names the template reads with `Fn::GetAtt`, so they are not secret.
 *
 * The same rule is implemented by `redactResponseData` in
 * `@aws-cdk/custom-resource-handlers` (`nodejs-entrypoint.ts` and
 * `core/nodejs-entrypoint-handler/index.ts`), which cannot import it; keep them in step.
 */
function redactDataFromPayload(payload) {
    // Create a deep copy of the payload object
    const redactedPayload = JSON.parse(JSON.stringify(payload));
    // Redact the data in the copied payload object
    const data = redactedPayload.Data;
    if (data === undefined || data === null) {
        return redactedPayload;
    }
    if (typeof data !== 'object' || Array.isArray(data)) {
        // masking per key only makes sense for an object; for anything else (for
        // example a string, whose characters cannot be overwritten) hide the whole value.
        return { ...redactedPayload, Data: '*****' };
    }
    return { ...redactedPayload, Data: Object.fromEntries(Object.keys(data).map(key => [key, '*****'])) };
}
class Retry extends Error {
}
exports.Retry = Retry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSx3Q0F3Q0M7QUFJRCxrQ0EyQ0M7QUFXRCxzREFlQztBQXhJRCx5Q0FBMkI7QUFDM0IseUNBQXlDO0FBQ3pDLGlDQUEwQztBQUc3QixRQUFBLGdDQUFnQyxHQUFHLHdEQUF3RCxDQUFDO0FBQzVGLFFBQUEsMEJBQTBCLEdBQUcsOERBQThELENBQUM7QUFpQmxHLEtBQUssVUFBVSxjQUFjLENBQUMsTUFBNEIsRUFBRSxLQUFpQyxFQUFFLFVBQXlDLEVBQUc7SUFDaEosMkVBQTJFO0lBQzNFLGdGQUFnRjtJQUNoRiwrRUFBK0U7SUFDL0Usa0VBQWtFO0lBQ2xFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDO0lBQ2hFLE1BQU0sSUFBSSxHQUFtRDtRQUMzRCxNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU07UUFDaEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1FBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztRQUMxQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCLElBQUksa0NBQTBCO1FBQzFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7UUFDMUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ2pDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNqQixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FB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QUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLHFCQUFxQixDQUFDLE9BQXdCO0lBQzVELDJDQUEyQztJQUMzQyxNQUFNLGVBQWUsR0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFN0UsK0NBQStDO0lBQy9DLE1BQU0sSUFBSSxHQUFZLGVBQWUsQ0FBQyxJQUFJLENBQUM7SUFDM0MsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3BELHlFQUF5RTtRQUN6RSxrRkFBa0Y7UUFDbEYsT0FBTyxFQUFFLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxPQUFjLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsT0FBTyxFQUFFLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDeEcsQ0FBQztBQUVELE1BQWEsS0FBTSxTQUFRLEtBQUs7Q0FBSTtBQUFwQyxzQkFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QgfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGxvZywgd2l0aFJldHJpZXMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHR5cGUgeyBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6OkNSRUFURV9GQUlMRUQnO1xuZXhwb3J0IGNvbnN0IE1JU1NJTkdfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6TUlTU0lOR19QSFlTSUNBTF9JRCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25SZXNwb25zZU9wdGlvbnMge1xuICByZWFkb25seSByZWFzb24/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG5vRWNobz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25FdmVudENvbnRleHQge1xuICBTdGFja0lkOiBzdHJpbmc7XG4gIFJlcXVlc3RJZDogc3RyaW5nO1xuICBQaHlzaWNhbFJlc291cmNlSWQ/OiBzdHJpbmc7XG4gIExvZ2ljYWxSZXNvdXJjZUlkOiBzdHJpbmc7XG4gIFJlc3BvbnNlVVJMOiBzdHJpbmc7XG4gIERhdGE/OiBhbnk7XG4gIE5vRWNobz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRSZXNwb25zZShzdGF0dXM6ICdTVUNDRVNTJyB8ICdGQUlMRUQnLCBldmVudDogQ2xvdWRGb3JtYXRpb25FdmVudENvbnRleHQsIG9wdGlvbnM6IENsb3VkRm9ybWF0aW9uUmVzcG9uc2VPcHRpb25zID0geyB9KSB7XG4gIC8vIE5vRWNobyBpcyBzZXQgaWYgZWl0aGVyIHRoZSBjYWxsZXIgb3IgdGhlIGV2ZW50IHNheXMgc28gKGZhaWwgY2xvc2VkKS4gQVxuICAvLyBGQUlMRUQgcmVzcG9uc2UgZm9yIGFuIGlzQ29tcGxldGUgcmVxdWVzdCAoc3VibWl0dGVkIGJ5IHNhZmVIYW5kbGVyKSBkb2VzIG5vdFxuICAvLyBwYXNzIHRoZSBvcHRpb24sIGJ1dCB0aGUgcmVxdWVzdCBzdGlsbCBjYXJyaWVzIHRoZSBEYXRhIHJldHVybmVkIGJ5IG9uRXZlbnQuXG4gIC8vIFRoZSBzYW1lIHZhbHVlIGRlY2lkZXMgYm90aCB0aGUgcmVzcG9uc2UgYm9keSBhbmQgdGhlIGxvZyBsaW5lLlxuICBjb25zdCBub0VjaG8gPSBvcHRpb25zLm5vRWNobyA9PT0gdHJ1ZSB8fCBldmVudC5Ob0VjaG8gPT09IHRydWU7XG4gIGNvbnN0IGpzb246IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlUmVzcG9uc2UgPSB7XG4gICAgU3RhdHVzOiBzdGF0dXMsXG4gICAgUmVhc29uOiBvcHRpb25zLnJlYXNvbiB8fCBzdGF0dXMsXG4gICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB8fCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUixcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgTm9FY2hvOiBub0VjaG8gPyB0cnVlIDogdW5kZWZpbmVkLFxuICAgIERhdGE6IGV2ZW50LkRhdGEsXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoanNvbik7XG5cbiAgY29uc3QgcGFyc2VkVXJsID0gdXJsLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgY29uc3QgbG9nZ2luZ1NhZmVVcmwgPSBgJHtwYXJzZWRVcmwucHJvdG9jb2x9Ly8ke3BhcnNlZFVybC5ob3N0bmFtZX0vJHtwYXJzZWRVcmwucGF0aG5hbWV9PyoqKmA7XG4gIGlmIChub0VjaG8pIHtcbiAgICBsb2coJ3N1Ym1pdCByZWRhY3RlZCByZXNwb25zZSB0byBjbG91ZGZvcm1hdGlvbicsIGxvZ2dpbmdTYWZlVXJsLCByZWRhY3REYXRhRnJvbVBheWxvYWQoanNvbikpO1xuICB9IGVsc2Uge1xuICAgIGxvZygnc3VibWl0IHJlc3BvbnNlIHRvIGNsb3VkZm9ybWF0aW9uJywgbG9nZ2luZ1NhZmVVcmwsIGpzb24pO1xuICB9XG5cbiAgY29uc3QgcmV0cnlPcHRpb25zID0ge1xuICAgIGF0dGVtcHRzOiA1LFxuICAgIHNsZWVwOiAxMDAwLFxuICB9O1xuICBhd2FpdCB3aXRoUmV0cmllcyhyZXRyeU9wdGlvbnMsIGh0dHBSZXF1ZXN0KSh7XG4gICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdjb250ZW50LXR5cGUnOiAnJyxcbiAgICAgICdjb250ZW50LWxlbmd0aCc6IEJ1ZmZlci5ieXRlTGVuZ3RoKHJlc3BvbnNlQm9keSwgJ3V0ZjgnKSxcbiAgICB9LFxuICB9LCByZXNwb25zZUJvZHkpO1xufVxuXG5leHBvcnQgbGV0IGluY2x1ZGVTdGFja1RyYWNlcyA9IHRydWU7IC8vIGZvciB1bml0IHRlc3RzXG5cbmV4cG9ydCBmdW5jdGlvbiBzYWZlSGFuZGxlcihibG9jazogKGV2ZW50OiBhbnkpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIGFzeW5jIChldmVudDogYW55KSA9PiB7XG4gICAgLy8gaWdub3JlIERFTEVURSBldmVudCB3aGVuIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBJRCBpcyB0aGUgbWFya2VyIHRoYXRcbiAgICAvLyBpbmRpY2F0ZXMgdGhhdCB0aGlzIERFTEVURSBpcyBhIHN1YnNlcXVlbnQgREVMRVRFIHRvIGEgZmFpbGVkIENSRUFURVxuICAgIC8vIG9wZXJhdGlvbi5cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9PT0gQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIpIHtcbiAgICAgIGxvZygnaWdub3JpbmcgREVMRVRFIGV2ZW50IGNhdXNlZCBieSBhIGZhaWxlZCBDUkVBVEUgZXZlbnQnKTtcbiAgICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBibG9jayhldmVudCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAvLyB0ZWxsIHdhaXRlciBzdGF0ZSBtYWNoaW5lIHRvIHJldHJ5XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIFJldHJ5KSB7XG4gICAgICAgIGxvZygncmV0cnkgcmVxdWVzdGVkIGJ5IGhhbmRsZXInKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFldmVudC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBpZiBDUkVBVEUgZmFpbHMsIHdoaWNoIHVzdWFsbHkgaW1wbGllcywgd2UgdXN1YWxseSBkb24ndFxuICAgICAgICAvLyBoYXZlIGEgcGh5c2ljYWwgcmVzb3VyY2UgaWQuIGluIHRoaXMgY2FzZSwgdGhlIHN1YnNlcXVlbnQgREVMRVRFXG4gICAgICAgIC8vIG9wZXJhdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBtZWFuaW5nLCBhbmQgd2lsbCBsaWtlbHkgZmFpbCBhcyB3ZWxsLiB0b1xuICAgICAgICAvLyBhZGRyZXNzIHRoaXMsIHdlIHVzZSBhIG1hcmtlciBzbyB0aGUgcHJvdmlkZXIgZnJhbWV3b3JrIGNhbiBzaW1wbHlcbiAgICAgICAgLy8gaWdub3JlIHRoZSBzdWJzZXF1ZW50IERFTEVURS5cbiAgICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICAgIGxvZygnQ1JFQVRFIGZhaWxlZCwgcmVzcG9uZGluZyB3aXRoIGEgbWFya2VyIHBoeXNpY2FsIHJlc291cmNlIGlkIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgREVMRVRFIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgICAgIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgUGh5c2ljYWxSZXNvdXJjZUlkIGlzIG5vdCBzcGVjaWZpZWQsIHNvbWV0aGluZyBpc1xuICAgICAgICAgIC8vIHRlcnJpYmx5IHdyb25nIGJlY2F1c2UgYWxsIG90aGVyIGV2ZW50cyBzaG91bGQgaGF2ZSBhbiBJRC5cbiAgICAgICAgICBjb25zdCBzYW5pdGl6ZWRFdmVudCA9IHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9O1xuICAgICAgICAgIGxvZyhgRVJST1I6IE1hbGZvcm1lZCBldmVudC4gXCJQaHlzaWNhbFJlc291cmNlSWRcIiBpcyByZXF1aXJlZDogJHtKU09OLnN0cmluZ2lmeShldmVudC5Ob0VjaG8gPT09IHRydWUgPyByZWRhY3REYXRhRnJvbVBheWxvYWQoc2FuaXRpemVkRXZlbnQpIDogc2FuaXRpemVkRXZlbnQpfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRoaXMgaXMgYW4gYWN0dWFsIGVycm9yLCBmYWlsIHRoZSBhY3Rpdml0eSBhbHRvZ2V0aGVyIGFuZCBleGlzdC5cbiAgICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCBldmVudCwge1xuICAgICAgICByZWFzb246IGluY2x1ZGVTdGFja1RyYWNlcyA/IGUuc3RhY2sgOiBlLm1lc3NhZ2UsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIHBheWxvYWQgd2l0aCBldmVyeSBgRGF0YWAgdmFsdWUgcmVwbGFjZWQsIGZvciBsb2dnaW5nIGFcbiAqIHBheWxvYWQgdGhhdCBoYXMgYE5vRWNob2Agc2V0LiBUaGUgYERhdGFgIGtleSBuYW1lcyBhcmUga2VwdDogdGhleSBhcmUgdGhlXG4gKiBhdHRyaWJ1dGUgbmFtZXMgdGhlIHRlbXBsYXRlIHJlYWRzIHdpdGggYEZuOjpHZXRBdHRgLCBzbyB0aGV5IGFyZSBub3Qgc2VjcmV0LlxuICpcbiAqIFRoZSBzYW1lIHJ1bGUgaXMgaW1wbGVtZW50ZWQgYnkgYHJlZGFjdFJlc3BvbnNlRGF0YWAgaW5cbiAqIGBAYXdzLWNkay9jdXN0b20tcmVzb3VyY2UtaGFuZGxlcnNgIChgbm9kZWpzLWVudHJ5cG9pbnQudHNgIGFuZFxuICogYGNvcmUvbm9kZWpzLWVudHJ5cG9pbnQtaGFuZGxlci9pbmRleC50c2ApLCB3aGljaCBjYW5ub3QgaW1wb3J0IGl0OyBrZWVwIHRoZW0gaW4gc3RlcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZGFjdERhdGFGcm9tUGF5bG9hZChwYXlsb2FkOiBPbkV2ZW50UmVzcG9uc2UpOiBPbkV2ZW50UmVzcG9uc2Uge1xuICAvLyBDcmVhdGUgYSBkZWVwIGNvcHkgb2YgdGhlIHBheWxvYWQgb2JqZWN0XG4gIGNvbnN0IHJlZGFjdGVkUGF5bG9hZDogT25FdmVudFJlc3BvbnNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG5cbiAgLy8gUmVkYWN0IHRoZSBkYXRhIGluIHRoZSBjb3BpZWQgcGF5bG9hZCBvYmplY3RcbiAgY29uc3QgZGF0YTogdW5rbm93biA9IHJlZGFjdGVkUGF5bG9hZC5EYXRhO1xuICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gcmVkYWN0ZWRQYXlsb2FkO1xuICB9XG4gIGlmICh0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIG1hc2tpbmcgcGVyIGtleSBvbmx5IG1ha2VzIHNlbnNlIGZvciBhbiBvYmplY3Q7IGZvciBhbnl0aGluZyBlbHNlIChmb3JcbiAgICAvLyBleGFtcGxlIGEgc3RyaW5nLCB3aG9zZSBjaGFyYWN0ZXJzIGNhbm5vdCBiZSBvdmVyd3JpdHRlbikgaGlkZSB0aGUgd2hvbGUgdmFsdWUuXG4gICAgcmV0dXJuIHsgLi4ucmVkYWN0ZWRQYXlsb2FkLCBEYXRhOiAnKioqKionIGFzIGFueSB9O1xuICB9XG4gIHJldHVybiB7IC4uLnJlZGFjdGVkUGF5bG9hZCwgRGF0YTogT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5rZXlzKGRhdGEpLm1hcChrZXkgPT4gW2tleSwgJyoqKioqJ10pKSB9O1xufVxuXG5leHBvcnQgY2xhc3MgUmV0cnkgZXh0ZW5kcyBFcnJvciB7IH1cbiJdfQ==