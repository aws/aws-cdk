"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retry = exports.safeHandler = exports.includeStackTraces = exports.submitResponse = exports.MISSING_PHYSICAL_ID_MARKER = exports.CREATE_FAILED_PHYSICAL_ID_MARKER = void 0;
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
    util_1.log('submit response to cloudformation', json);
    const responseBody = JSON.stringify(json);
    const parsedUrl = url.parse(event.ResponseURL);
    const retryOptions = {
        attempts: 5,
        sleep: 1000,
    };
    await util_1.withRetries(retryOptions, outbound_1.httpRequest)({
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': responseBody.length,
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
            util_1.log('ignoring DELETE event caused by a failed CREATE event');
            await submitResponse('SUCCESS', event);
            return;
        }
        try {
            await block(event);
        }
        catch (e) {
            // tell waiter state machine to retry
            if (e instanceof Retry) {
                util_1.log('retry requested by handler');
                throw e;
            }
            if (!event.PhysicalResourceId) {
                // special case: if CREATE fails, which usually implies, we usually don't
                // have a physical resource id. in this case, the subsequent DELETE
                // operation does not have any meaning, and will likely fail as well. to
                // address this, we use a marker so the provider framework can simply
                // ignore the subsequent DELETE.
                if (event.RequestType === 'Create') {
                    util_1.log('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
                    event.PhysicalResourceId = exports.CREATE_FAILED_PHYSICAL_ID_MARKER;
                }
                else {
                    // otherwise, if PhysicalResourceId is not specified, something is
                    // terribly wrong because all other events should have an ID.
                    util_1.log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
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
class Retry extends Error {
}
exports.Retry = Retry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBQzNCLHlDQUF5QztBQUN6QyxpQ0FBMEM7QUFFN0IsUUFBQSxnQ0FBZ0MsR0FBRyx3REFBd0QsQ0FBQztBQUM1RixRQUFBLDBCQUEwQixHQUFHLDhEQUE4RCxDQUFDO0FBZ0JsRyxLQUFLLFVBQVUsY0FBYyxDQUFDLE1BQTRCLEVBQUUsS0FBaUMsRUFBRSxVQUF5QyxFQUFHO0lBQ2hKLE1BQU0sSUFBSSxHQUFtRDtRQUMzRCxNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU07UUFDaEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1FBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztRQUMxQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCLElBQUksa0NBQTBCO1FBQzFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7UUFDMUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNqQixDQUFDO0lBRUYsVUFBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRS9DLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFL0MsTUFBTSxZQUFZLEdBQUc7UUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaLENBQUM7SUFDRixNQUFNLGtCQUFXLENBQUMsWUFBWSxFQUFFLHNCQUFXLENBQUMsQ0FBQztRQUMzQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7UUFDNUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO1FBQ3BCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsY0FBYyxFQUFFLEVBQUU7WUFDbEIsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLE1BQU07U0FDdEM7S0FDRixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUEvQkQsd0NBK0JDO0FBRVUsUUFBQSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUI7QUFFdkQsU0FBZ0IsV0FBVyxDQUFDLEtBQW9DO0lBQzlELE9BQU8sS0FBSyxFQUFFLEtBQVUsRUFBRSxFQUFFO1FBRTFCLHVFQUF1RTtRQUN2RSx1RUFBdUU7UUFDdkUsYUFBYTtRQUNiLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLGtCQUFrQixLQUFLLHdDQUFnQyxFQUFFO1lBQ25HLFVBQUcsQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQzdELE1BQU0sY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxPQUFPO1NBQ1I7UUFFRCxJQUFJO1lBQ0YsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLHFDQUFxQztZQUNyQyxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUU7Z0JBQ3RCLFVBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsQ0FBQzthQUNUO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtnQkFDN0IseUVBQXlFO2dCQUN6RSxtRUFBbUU7Z0JBQ25FLHdFQUF3RTtnQkFDeEUscUVBQXFFO2dCQUNyRSxnQ0FBZ0M7Z0JBQ2hDLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7b0JBQ2xDLFVBQUcsQ0FBQyw0R0FBNEcsQ0FBQyxDQUFDO29CQUNsSCxLQUFLLENBQUMsa0JBQWtCLEdBQUcsd0NBQWdDLENBQUM7aUJBQzdEO3FCQUFNO29CQUNMLGtFQUFrRTtvQkFDbEUsNkRBQTZEO29CQUM3RCxVQUFHLENBQUMsNkRBQTZELElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ3RIO2FBQ0Y7WUFFRCxtRUFBbUU7WUFDbkUsTUFBTSxjQUFjLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDcEMsTUFBTSxFQUFFLDBCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzthQUNqRCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUEzQ0Qsa0NBMkNDO0FBRUQsTUFBYSxLQUFNLFNBQVEsS0FBSztDQUFJO0FBQXBDLHNCQUFvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QgfSBmcm9tICcuL291dGJvdW5kJztcbmltcG9ydCB7IGxvZywgd2l0aFJldHJpZXMgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpDUkVBVEVfRkFJTEVEJztcbmV4cG9ydCBjb25zdCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6Ok1JU1NJTkdfUEhZU0lDQUxfSUQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uUmVzcG9uc2VPcHRpb25zIHtcbiAgcmVhZG9ubHkgcmVhc29uPzogc3RyaW5nO1xuICByZWFkb25seSBub0VjaG8/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uRXZlbnRDb250ZXh0IHtcbiAgU3RhY2tJZDogc3RyaW5nO1xuICBSZXF1ZXN0SWQ6IHN0cmluZztcbiAgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nO1xuICBMb2dpY2FsUmVzb3VyY2VJZDogc3RyaW5nO1xuICBSZXNwb25zZVVSTDogc3RyaW5nO1xuICBEYXRhPzogYW55XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRSZXNwb25zZShzdGF0dXM6ICdTVUNDRVNTJyB8ICdGQUlMRUQnLCBldmVudDogQ2xvdWRGb3JtYXRpb25FdmVudENvbnRleHQsIG9wdGlvbnM6IENsb3VkRm9ybWF0aW9uUmVzcG9uc2VPcHRpb25zID0geyB9KSB7XG4gIGNvbnN0IGpzb246IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlUmVzcG9uc2UgPSB7XG4gICAgU3RhdHVzOiBzdGF0dXMsXG4gICAgUmVhc29uOiBvcHRpb25zLnJlYXNvbiB8fCBzdGF0dXMsXG4gICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB8fCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUixcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgTm9FY2hvOiBvcHRpb25zLm5vRWNobyxcbiAgICBEYXRhOiBldmVudC5EYXRhLFxuICB9O1xuXG4gIGxvZygnc3VibWl0IHJlc3BvbnNlIHRvIGNsb3VkZm9ybWF0aW9uJywganNvbik7XG5cbiAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoanNvbik7XG5cbiAgY29uc3QgcGFyc2VkVXJsID0gdXJsLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcblxuICBjb25zdCByZXRyeU9wdGlvbnMgPSB7XG4gICAgYXR0ZW1wdHM6IDUsXG4gICAgc2xlZXA6IDEwMDAsXG4gIH07XG4gIGF3YWl0IHdpdGhSZXRyaWVzKHJldHJ5T3B0aW9ucywgaHR0cFJlcXVlc3QpKHtcbiAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogcmVzcG9uc2VCb2R5Lmxlbmd0aCxcbiAgICB9LFxuICB9LCByZXNwb25zZUJvZHkpO1xufVxuXG5leHBvcnQgbGV0IGluY2x1ZGVTdGFja1RyYWNlcyA9IHRydWU7IC8vIGZvciB1bml0IHRlc3RzXG5cbmV4cG9ydCBmdW5jdGlvbiBzYWZlSGFuZGxlcihibG9jazogKGV2ZW50OiBhbnkpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIGFzeW5jIChldmVudDogYW55KSA9PiB7XG5cbiAgICAvLyBpZ25vcmUgREVMRVRFIGV2ZW50IHdoZW4gdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGlzIHRoZSBtYXJrZXIgdGhhdFxuICAgIC8vIGluZGljYXRlcyB0aGF0IHRoaXMgREVMRVRFIGlzIGEgc3Vic2VxdWVudCBERUxFVEUgdG8gYSBmYWlsZWQgQ1JFQVRFXG4gICAgLy8gb3BlcmF0aW9uLlxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkID09PSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUikge1xuICAgICAgbG9nKCdpZ25vcmluZyBERUxFVEUgZXZlbnQgY2F1c2VkIGJ5IGEgZmFpbGVkIENSRUFURSBldmVudCcpO1xuICAgICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCBldmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGJsb2NrKGV2ZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB0ZWxsIHdhaXRlciBzdGF0ZSBtYWNoaW5lIHRvIHJldHJ5XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIFJldHJ5KSB7XG4gICAgICAgIGxvZygncmV0cnkgcmVxdWVzdGVkIGJ5IGhhbmRsZXInKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFldmVudC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBpZiBDUkVBVEUgZmFpbHMsIHdoaWNoIHVzdWFsbHkgaW1wbGllcywgd2UgdXN1YWxseSBkb24ndFxuICAgICAgICAvLyBoYXZlIGEgcGh5c2ljYWwgcmVzb3VyY2UgaWQuIGluIHRoaXMgY2FzZSwgdGhlIHN1YnNlcXVlbnQgREVMRVRFXG4gICAgICAgIC8vIG9wZXJhdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBtZWFuaW5nLCBhbmQgd2lsbCBsaWtlbHkgZmFpbCBhcyB3ZWxsLiB0b1xuICAgICAgICAvLyBhZGRyZXNzIHRoaXMsIHdlIHVzZSBhIG1hcmtlciBzbyB0aGUgcHJvdmlkZXIgZnJhbWV3b3JrIGNhbiBzaW1wbHlcbiAgICAgICAgLy8gaWdub3JlIHRoZSBzdWJzZXF1ZW50IERFTEVURS5cbiAgICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICAgIGxvZygnQ1JFQVRFIGZhaWxlZCwgcmVzcG9uZGluZyB3aXRoIGEgbWFya2VyIHBoeXNpY2FsIHJlc291cmNlIGlkIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgREVMRVRFIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgICAgIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgUGh5c2ljYWxSZXNvdXJjZUlkIGlzIG5vdCBzcGVjaWZpZWQsIHNvbWV0aGluZyBpc1xuICAgICAgICAgIC8vIHRlcnJpYmx5IHdyb25nIGJlY2F1c2UgYWxsIG90aGVyIGV2ZW50cyBzaG91bGQgaGF2ZSBhbiBJRC5cbiAgICAgICAgICBsb2coYEVSUk9SOiBNYWxmb3JtZWQgZXZlbnQuIFwiUGh5c2ljYWxSZXNvdXJjZUlkXCIgaXMgcmVxdWlyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRoaXMgaXMgYW4gYWN0dWFsIGVycm9yLCBmYWlsIHRoZSBhY3Rpdml0eSBhbHRvZ2V0aGVyIGFuZCBleGlzdC5cbiAgICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCBldmVudCwge1xuICAgICAgICByZWFzb246IGluY2x1ZGVTdGFja1RyYWNlcyA/IGUuc3RhY2sgOiBlLm1lc3NhZ2UsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBSZXRyeSBleHRlbmRzIEVycm9yIHsgfVxuIl19