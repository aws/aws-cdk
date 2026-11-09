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
    const json = {
        Status: status,
        Reason: options.reason || status,
        StackId: event.StackId,
        RequestId: event.RequestId,
        PhysicalResourceId: event.PhysicalResourceId || exports.MISSING_PHYSICAL_ID_MARKER,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: options.noEcho,
        Data: event.Data,
    };
    const responseBody = JSON.stringify(json);
    const parsedUrl = url.parse(event.ResponseURL);
    const loggingSafeUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/${parsedUrl.pathname}?***`;
    // redact the logged Data when either the caller or the event says NoEcho: a
    // FAILED response for an isComplete request (submitted by safeHandler) does not
    // pass the option, but the request still carries the Data returned by onEvent.
    if (options.noEcho ?? event.NoEcho) {
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
                    (0, util_1.log)(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
                }
            }
            // this is an actual error, fail the activity altogether and exist.
            await submitResponse('FAILED', event, {
                reason: exports.includeStackTraces ? e.stack : e.message,
            });
        }
    };
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSx3Q0FzQ0M7QUFJRCxrQ0EwQ0M7QUFFRCxzREFlQztBQTVIRCx5Q0FBMkI7QUFDM0IseUNBQXlDO0FBQ3pDLGlDQUEwQztBQUc3QixRQUFBLGdDQUFnQyxHQUFHLHdEQUF3RCxDQUFDO0FBQzVGLFFBQUEsMEJBQTBCLEdBQUcsOERBQThELENBQUM7QUFpQmxHLEtBQUssVUFBVSxjQUFjLENBQUMsTUFBNEIsRUFBRSxLQUFpQyxFQUFFLFVBQXlDLEVBQUc7SUFDaEosTUFBTSxJQUFJLEdBQW1EO1FBQzNELE1BQU0sRUFBRSxNQUFNO1FBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTTtRQUNoQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDdEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1FBQzFCLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxrQ0FBMEI7UUFDMUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtRQUMxQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07UUFDdEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0tBQ2pCLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTFDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sY0FBYyxHQUFHLEdBQUcsU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxRQUFRLE1BQU0sQ0FBQztJQUNoRyw0RUFBNEU7SUFDNUUsZ0ZBQWdGO0lBQ2hGLCtFQUErRTtJ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UyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFN0UsK0NBQStDO0lBQy9DLE1BQU0sSUFBSSxHQUFZLGVBQWUsQ0FBQyxJQUFJLENBQUM7SUFDM0MsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3BELHlFQUF5RTtRQUN6RSxrRkFBa0Y7UUFDbEYsT0FBTyxFQUFFLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxPQUFjLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsT0FBTyxFQUFFLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDeEcsQ0FBQztBQUVELE1BQWEsS0FBTSxTQUFRLEtBQUs7Q0FBSTtBQUFwQyxzQkFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QgfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGxvZywgd2l0aFJldHJpZXMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHR5cGUgeyBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6OkNSRUFURV9GQUlMRUQnO1xuZXhwb3J0IGNvbnN0IE1JU1NJTkdfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6TUlTU0lOR19QSFlTSUNBTF9JRCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25SZXNwb25zZU9wdGlvbnMge1xuICByZWFkb25seSByZWFzb24/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG5vRWNobz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25FdmVudENvbnRleHQge1xuICBTdGFja0lkOiBzdHJpbmc7XG4gIFJlcXVlc3RJZDogc3RyaW5nO1xuICBQaHlzaWNhbFJlc291cmNlSWQ/OiBzdHJpbmc7XG4gIExvZ2ljYWxSZXNvdXJjZUlkOiBzdHJpbmc7XG4gIFJlc3BvbnNlVVJMOiBzdHJpbmc7XG4gIERhdGE/OiBhbnk7XG4gIE5vRWNobz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRSZXNwb25zZShzdGF0dXM6ICdTVUNDRVNTJyB8ICdGQUlMRUQnLCBldmVudDogQ2xvdWRGb3JtYXRpb25FdmVudENvbnRleHQsIG9wdGlvbnM6IENsb3VkRm9ybWF0aW9uUmVzcG9uc2VPcHRpb25zID0geyB9KSB7XG4gIGNvbnN0IGpzb246IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlUmVzcG9uc2UgPSB7XG4gICAgU3RhdHVzOiBzdGF0dXMsXG4gICAgUmVhc29uOiBvcHRpb25zLnJlYXNvbiB8fCBzdGF0dXMsXG4gICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB8fCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUixcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgTm9FY2hvOiBvcHRpb25zLm5vRWNobyxcbiAgICBEYXRhOiBldmVudC5EYXRhLFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KGpzb24pO1xuXG4gIGNvbnN0IHBhcnNlZFVybCA9IHVybC5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gIGNvbnN0IGxvZ2dpbmdTYWZlVXJsID0gYCR7cGFyc2VkVXJsLnByb3RvY29sfS8vJHtwYXJzZWRVcmwuaG9zdG5hbWV9LyR7cGFyc2VkVXJsLnBhdGhuYW1lfT8qKipgO1xuICAvLyByZWRhY3QgdGhlIGxvZ2dlZCBEYXRhIHdoZW4gZWl0aGVyIHRoZSBjYWxsZXIgb3IgdGhlIGV2ZW50IHNheXMgTm9FY2hvOiBhXG4gIC8vIEZBSUxFRCByZXNwb25zZSBmb3IgYW4gaXNDb21wbGV0ZSByZXF1ZXN0IChzdWJtaXR0ZWQgYnkgc2FmZUhhbmRsZXIpIGRvZXMgbm90XG4gIC8vIHBhc3MgdGhlIG9wdGlvbiwgYnV0IHRoZSByZXF1ZXN0IHN0aWxsIGNhcnJpZXMgdGhlIERhdGEgcmV0dXJuZWQgYnkgb25FdmVudC5cbiAgaWYgKG9wdGlvbnMubm9FY2hvID8/IGV2ZW50Lk5vRWNobykge1xuICAgIGxvZygnc3VibWl0IHJlZGFjdGVkIHJlc3BvbnNlIHRvIGNsb3VkZm9ybWF0aW9uJywgbG9nZ2luZ1NhZmVVcmwsIHJlZGFjdERhdGFGcm9tUGF5bG9hZChqc29uKSk7XG4gIH0gZWxzZSB7XG4gICAgbG9nKCdzdWJtaXQgcmVzcG9uc2UgdG8gY2xvdWRmb3JtYXRpb24nLCBsb2dnaW5nU2FmZVVybCwganNvbik7XG4gIH1cblxuICBjb25zdCByZXRyeU9wdGlvbnMgPSB7XG4gICAgYXR0ZW1wdHM6IDUsXG4gICAgc2xlZXA6IDEwMDAsXG4gIH07XG4gIGF3YWl0IHdpdGhSZXRyaWVzKHJldHJ5T3B0aW9ucywgaHR0cFJlcXVlc3QpKHtcbiAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogQnVmZmVyLmJ5dGVMZW5ndGgocmVzcG9uc2VCb2R5LCAndXRmOCcpLFxuICAgIH0sXG4gIH0sIHJlc3BvbnNlQm9keSk7XG59XG5cbmV4cG9ydCBsZXQgaW5jbHVkZVN0YWNrVHJhY2VzID0gdHJ1ZTsgLy8gZm9yIHVuaXQgdGVzdHNcblxuZXhwb3J0IGZ1bmN0aW9uIHNhZmVIYW5kbGVyKGJsb2NrOiAoZXZlbnQ6IGFueSkgPT4gUHJvbWlzZTx2b2lkPikge1xuICByZXR1cm4gYXN5bmMgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAvLyBpZ25vcmUgREVMRVRFIGV2ZW50IHdoZW4gdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGlzIHRoZSBtYXJrZXIgdGhhdFxuICAgIC8vIGluZGljYXRlcyB0aGF0IHRoaXMgREVMRVRFIGlzIGEgc3Vic2VxdWVudCBERUxFVEUgdG8gYSBmYWlsZWQgQ1JFQVRFXG4gICAgLy8gb3BlcmF0aW9uLlxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkID09PSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUikge1xuICAgICAgbG9nKCdpZ25vcmluZyBERUxFVEUgZXZlbnQgY2F1c2VkIGJ5IGEgZmFpbGVkIENSRUFURSBldmVudCcpO1xuICAgICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCBldmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGJsb2NrKGV2ZW50KTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIC8vIHRlbGwgd2FpdGVyIHN0YXRlIG1hY2hpbmUgdG8gcmV0cnlcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgUmV0cnkpIHtcbiAgICAgICAgbG9nKCdyZXRyeSByZXF1ZXN0ZWQgYnkgaGFuZGxlcicpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGlmIENSRUFURSBmYWlscywgd2hpY2ggdXN1YWxseSBpbXBsaWVzLCB3ZSB1c3VhbGx5IGRvbid0XG4gICAgICAgIC8vIGhhdmUgYSBwaHlzaWNhbCByZXNvdXJjZSBpZC4gaW4gdGhpcyBjYXNlLCB0aGUgc3Vic2VxdWVudCBERUxFVEVcbiAgICAgICAgLy8gb3BlcmF0aW9uIGRvZXMgbm90IGhhdmUgYW55IG1lYW5pbmcsIGFuZCB3aWxsIGxpa2VseSBmYWlsIGFzIHdlbGwuIHRvXG4gICAgICAgIC8vIGFkZHJlc3MgdGhpcywgd2UgdXNlIGEgbWFya2VyIHNvIHRoZSBwcm92aWRlciBmcmFtZXdvcmsgY2FuIHNpbXBseVxuICAgICAgICAvLyBpZ25vcmUgdGhlIHN1YnNlcXVlbnQgREVMRVRFLlxuICAgICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgICAgbG9nKCdDUkVBVEUgZmFpbGVkLCByZXNwb25kaW5nIHdpdGggYSBtYXJrZXIgcGh5c2ljYWwgcmVzb3VyY2UgaWQgc28gdGhhdCB0aGUgc3Vic2VxdWVudCBERUxFVEUgd2lsbCBiZSBpZ25vcmVkJyk7XG4gICAgICAgICAgZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkID0gQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBQaHlzaWNhbFJlc291cmNlSWQgaXMgbm90IHNwZWNpZmllZCwgc29tZXRoaW5nIGlzXG4gICAgICAgICAgLy8gdGVycmlibHkgd3JvbmcgYmVjYXVzZSBhbGwgb3RoZXIgZXZlbnRzIHNob3VsZCBoYXZlIGFuIElELlxuICAgICAgICAgIGxvZyhgRVJST1I6IE1hbGZvcm1lZCBldmVudC4gXCJQaHlzaWNhbFJlc291cmNlSWRcIiBpcyByZXF1aXJlZDogJHtKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdGhpcyBpcyBhbiBhY3R1YWwgZXJyb3IsIGZhaWwgdGhlIGFjdGl2aXR5IGFsdG9nZXRoZXIgYW5kIGV4aXN0LlxuICAgICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ0ZBSUxFRCcsIGV2ZW50LCB7XG4gICAgICAgIHJlYXNvbjogaW5jbHVkZVN0YWNrVHJhY2VzID8gZS5zdGFjayA6IGUubWVzc2FnZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZGFjdERhdGFGcm9tUGF5bG9hZChwYXlsb2FkOiBPbkV2ZW50UmVzcG9uc2UpOiBPbkV2ZW50UmVzcG9uc2Uge1xuICAvLyBDcmVhdGUgYSBkZWVwIGNvcHkgb2YgdGhlIHBheWxvYWQgb2JqZWN0XG4gIGNvbnN0IHJlZGFjdGVkUGF5bG9hZDogT25FdmVudFJlc3BvbnNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG5cbiAgLy8gUmVkYWN0IHRoZSBkYXRhIGluIHRoZSBjb3BpZWQgcGF5bG9hZCBvYmplY3RcbiAgY29uc3QgZGF0YTogdW5rbm93biA9IHJlZGFjdGVkUGF5bG9hZC5EYXRhO1xuICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gcmVkYWN0ZWRQYXlsb2FkO1xuICB9XG4gIGlmICh0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIG1hc2tpbmcgcGVyIGtleSBvbmx5IG1ha2VzIHNlbnNlIGZvciBhbiBvYmplY3Q7IGZvciBhbnl0aGluZyBlbHNlIChmb3JcbiAgICAvLyBleGFtcGxlIGEgc3RyaW5nLCB3aG9zZSBjaGFyYWN0ZXJzIGNhbm5vdCBiZSBvdmVyd3JpdHRlbikgaGlkZSB0aGUgd2hvbGUgdmFsdWUuXG4gICAgcmV0dXJuIHsgLi4ucmVkYWN0ZWRQYXlsb2FkLCBEYXRhOiAnKioqKionIGFzIGFueSB9O1xuICB9XG4gIHJldHVybiB7IC4uLnJlZGFjdGVkUGF5bG9hZCwgRGF0YTogT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5rZXlzKGRhdGEpLm1hcChrZXkgPT4gW2tleSwgJyoqKioqJ10pKSB9O1xufVxuXG5leHBvcnQgY2xhc3MgUmV0cnkgZXh0ZW5kcyBFcnJvciB7IH1cbiJdfQ==