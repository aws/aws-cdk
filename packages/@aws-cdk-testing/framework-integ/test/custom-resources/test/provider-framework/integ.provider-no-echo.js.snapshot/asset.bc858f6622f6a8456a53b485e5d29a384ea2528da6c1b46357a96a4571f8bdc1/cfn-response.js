"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retry = exports.redactDataFromPayload = exports.safeHandler = exports.includeStackTraces = exports.submitResponse = exports.MISSING_PHYSICAL_ID_MARKER = exports.CREATE_FAILED_PHYSICAL_ID_MARKER = void 0;
/* eslint-disable max-len */
/* eslint-disable no-console */
const url = require("url");
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
    if (options.noEcho) {
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
exports.submitResponse = submitResponse;
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
exports.safeHandler = safeHandler;
function redactDataFromPayload(payload) {
    // Create a deep copy of the payload object
    const redactedPayload = JSON.parse(JSON.stringify(payload));
    // Redact the data in the copied payload object
    if (redactedPayload.Data) {
        const keys = Object.keys(redactedPayload.Data);
        for (const key of keys) {
            redactedPayload.Data[key] = '*****';
        }
    }
    return redactedPayload;
}
exports.redactDataFromPayload = redactDataFromPayload;
class Retry extends Error {
}
exports.Retry = Retry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBQzNCLHlDQUF5QztBQUN6QyxpQ0FBMEM7QUFHN0IsUUFBQSxnQ0FBZ0MsR0FBRyx3REFBd0QsQ0FBQztBQUM1RixRQUFBLDBCQUEwQixHQUFHLDhEQUE4RCxDQUFDO0FBZ0JsRyxLQUFLLFVBQVUsY0FBYyxDQUFDLE1BQTRCLEVBQUUsS0FBaUMsRUFBRSxVQUF5QyxFQUFHO0lBQ2hKLE1BQU0sSUFBSSxHQUFtRDtRQUMzRCxNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU07UUFDaEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1FBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztRQUMxQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCLElBQUksa0NBQTBCO1FBQzFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7UUFDMUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNqQixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxNQUFNLGNBQWMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsUUFBUSxNQUFNLENBQUM7SUFDaEcsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkIsSUFBQSxVQUFHLEVBQUMsNENBQTRDLEVBQUUsY0FBYyxFQUFFLHFCQUFx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QUN6QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3RDLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxlQUFlLENBQUM7QUFDekIsQ0FBQztBQVpELHNEQVlDO0FBRUQsTUFBYSxLQUFNLFNBQVEsS0FBSztDQUFJO0FBQXBDLHNCQUFvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QgfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGxvZywgd2l0aFJldHJpZXMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgT25FdmVudFJlc3BvbnNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpDUkVBVEVfRkFJTEVEJztcbmV4cG9ydCBjb25zdCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6Ok1JU1NJTkdfUEhZU0lDQUxfSUQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uUmVzcG9uc2VPcHRpb25zIHtcbiAgcmVhZG9ubHkgcmVhc29uPzogc3RyaW5nO1xuICByZWFkb25seSBub0VjaG8/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uRXZlbnRDb250ZXh0IHtcbiAgU3RhY2tJZDogc3RyaW5nO1xuICBSZXF1ZXN0SWQ6IHN0cmluZztcbiAgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nO1xuICBMb2dpY2FsUmVzb3VyY2VJZDogc3RyaW5nO1xuICBSZXNwb25zZVVSTDogc3RyaW5nO1xuICBEYXRhPzogYW55O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VibWl0UmVzcG9uc2Uoc3RhdHVzOiAnU1VDQ0VTUycgfCAnRkFJTEVEJywgZXZlbnQ6IENsb3VkRm9ybWF0aW9uRXZlbnRDb250ZXh0LCBvcHRpb25zOiBDbG91ZEZvcm1hdGlvblJlc3BvbnNlT3B0aW9ucyA9IHsgfSkge1xuICBjb25zdCBqc29uOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVJlc3BvbnNlID0ge1xuICAgIFN0YXR1czogc3RhdHVzLFxuICAgIFJlYXNvbjogb3B0aW9ucy5yZWFzb24gfHwgc3RhdHVzLFxuICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgfHwgTUlTU0lOR19QSFlTSUNBTF9JRF9NQVJLRVIsXG4gICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgIE5vRWNobzogb3B0aW9ucy5ub0VjaG8sXG4gICAgRGF0YTogZXZlbnQuRGF0YSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeShqc29uKTtcblxuICBjb25zdCBwYXJzZWRVcmwgPSB1cmwucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICBjb25zdCBsb2dnaW5nU2FmZVVybCA9IGAke3BhcnNlZFVybC5wcm90b2NvbH0vLyR7cGFyc2VkVXJsLmhvc3RuYW1lfS8ke3BhcnNlZFVybC5wYXRobmFtZX0/KioqYDtcbiAgaWYgKG9wdGlvbnMubm9FY2hvKSB7XG4gICAgbG9nKCdzdWJtaXQgcmVkYWN0ZWQgcmVzcG9uc2UgdG8gY2xvdWRmb3JtYXRpb24nLCBsb2dnaW5nU2FmZVVybCwgcmVkYWN0RGF0YUZyb21QYXlsb2FkKGpzb24pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2coJ3N1Ym1pdCByZXNwb25zZSB0byBjbG91ZGZvcm1hdGlvbicsIGxvZ2dpbmdTYWZlVXJsLCBqc29uKTtcbiAgfVxuXG4gIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHtcbiAgICBhdHRlbXB0czogNSxcbiAgICBzbGVlcDogMTAwMCxcbiAgfTtcbiAgYXdhaXQgd2l0aFJldHJpZXMocmV0cnlPcHRpb25zLCBodHRwUmVxdWVzdCkoe1xuICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnY29udGVudC10eXBlJzogJycsXG4gICAgICAnY29udGVudC1sZW5ndGgnOiBCdWZmZXIuYnl0ZUxlbmd0aChyZXNwb25zZUJvZHksICd1dGY4JyksXG4gICAgfSxcbiAgfSwgcmVzcG9uc2VCb2R5KTtcbn1cblxuZXhwb3J0IGxldCBpbmNsdWRlU3RhY2tUcmFjZXMgPSB0cnVlOyAvLyBmb3IgdW5pdCB0ZXN0c1xuXG5leHBvcnQgZnVuY3Rpb24gc2FmZUhhbmRsZXIoYmxvY2s6IChldmVudDogYW55KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiBhc3luYyAoZXZlbnQ6IGFueSkgPT4ge1xuXG4gICAgLy8gaWdub3JlIERFTEVURSBldmVudCB3aGVuIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBJRCBpcyB0aGUgbWFya2VyIHRoYXRcbiAgICAvLyBpbmRpY2F0ZXMgdGhhdCB0aGlzIERFTEVURSBpcyBhIHN1YnNlcXVlbnQgREVMRVRFIHRvIGEgZmFpbGVkIENSRUFURVxuICAgIC8vIG9wZXJhdGlvbi5cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9PT0gQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIpIHtcbiAgICAgIGxvZygnaWdub3JpbmcgREVMRVRFIGV2ZW50IGNhdXNlZCBieSBhIGZhaWxlZCBDUkVBVEUgZXZlbnQnKTtcbiAgICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBibG9jayhldmVudCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAvLyB0ZWxsIHdhaXRlciBzdGF0ZSBtYWNoaW5lIHRvIHJldHJ5XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIFJldHJ5KSB7XG4gICAgICAgIGxvZygncmV0cnkgcmVxdWVzdGVkIGJ5IGhhbmRsZXInKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFldmVudC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBpZiBDUkVBVEUgZmFpbHMsIHdoaWNoIHVzdWFsbHkgaW1wbGllcywgd2UgdXN1YWxseSBkb24ndFxuICAgICAgICAvLyBoYXZlIGEgcGh5c2ljYWwgcmVzb3VyY2UgaWQuIGluIHRoaXMgY2FzZSwgdGhlIHN1YnNlcXVlbnQgREVMRVRFXG4gICAgICAgIC8vIG9wZXJhdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBtZWFuaW5nLCBhbmQgd2lsbCBsaWtlbHkgZmFpbCBhcyB3ZWxsLiB0b1xuICAgICAgICAvLyBhZGRyZXNzIHRoaXMsIHdlIHVzZSBhIG1hcmtlciBzbyB0aGUgcHJvdmlkZXIgZnJhbWV3b3JrIGNhbiBzaW1wbHlcbiAgICAgICAgLy8gaWdub3JlIHRoZSBzdWJzZXF1ZW50IERFTEVURS5cbiAgICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICAgIGxvZygnQ1JFQVRFIGZhaWxlZCwgcmVzcG9uZGluZyB3aXRoIGEgbWFya2VyIHBoeXNpY2FsIHJlc291cmNlIGlkIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgREVMRVRFIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgICAgIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgUGh5c2ljYWxSZXNvdXJjZUlkIGlzIG5vdCBzcGVjaWZpZWQsIHNvbWV0aGluZyBpc1xuICAgICAgICAgIC8vIHRlcnJpYmx5IHdyb25nIGJlY2F1c2UgYWxsIG90aGVyIGV2ZW50cyBzaG91bGQgaGF2ZSBhbiBJRC5cbiAgICAgICAgICBsb2coYEVSUk9SOiBNYWxmb3JtZWQgZXZlbnQuIFwiUGh5c2ljYWxSZXNvdXJjZUlkXCIgaXMgcmVxdWlyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRoaXMgaXMgYW4gYWN0dWFsIGVycm9yLCBmYWlsIHRoZSBhY3Rpdml0eSBhbHRvZ2V0aGVyIGFuZCBleGlzdC5cbiAgICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCBldmVudCwge1xuICAgICAgICByZWFzb246IGluY2x1ZGVTdGFja1RyYWNlcyA/IGUuc3RhY2sgOiBlLm1lc3NhZ2UsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWRhY3REYXRhRnJvbVBheWxvYWQocGF5bG9hZDogT25FdmVudFJlc3BvbnNlKSB7XG4gIC8vIENyZWF0ZSBhIGRlZXAgY29weSBvZiB0aGUgcGF5bG9hZCBvYmplY3RcbiAgY29uc3QgcmVkYWN0ZWRQYXlsb2FkOiBPbkV2ZW50UmVzcG9uc2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcblxuICAvLyBSZWRhY3QgdGhlIGRhdGEgaW4gdGhlIGNvcGllZCBwYXlsb2FkIG9iamVjdFxuICBpZiAocmVkYWN0ZWRQYXlsb2FkLkRhdGEpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVkYWN0ZWRQYXlsb2FkLkRhdGEpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIHJlZGFjdGVkUGF5bG9hZC5EYXRhW2tleV0gPSAnKioqKionO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVkYWN0ZWRQYXlsb2FkO1xufVxuXG5leHBvcnQgY2xhc3MgUmV0cnkgZXh0ZW5kcyBFcnJvciB7IH1cbiJdfQ==