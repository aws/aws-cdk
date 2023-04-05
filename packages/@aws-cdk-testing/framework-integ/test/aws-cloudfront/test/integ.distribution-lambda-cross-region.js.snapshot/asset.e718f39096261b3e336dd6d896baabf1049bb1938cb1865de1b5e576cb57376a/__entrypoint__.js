"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.external = void 0;
const https = require("https");
const url = require("url");
// for unit tests
exports.external = {
    sendHttpRequest: defaultSendHttpRequest,
    log: defaultLog,
    includeStackTraces: true,
    userHandlerIndex: './index',
};
const CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED';
const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID';
async function handler(event, context) {
    exports.external.log(JSON.stringify(event, undefined, 2));
    // ignore DELETE event when the physical resource ID is the marker that
    // indicates that this DELETE is a subsequent DELETE to a failed CREATE
    // operation.
    if (event.RequestType === 'Delete' && event.PhysicalResourceId === CREATE_FAILED_PHYSICAL_ID_MARKER) {
        exports.external.log('ignoring DELETE event caused by a failed CREATE event');
        await submitResponse('SUCCESS', event);
        return;
    }
    try {
        // invoke the user handler. this is intentionally inside the try-catch to
        // ensure that if there is an error it's reported as a failure to
        // cloudformation (otherwise cfn waits).
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const userHandler = require(exports.external.userHandlerIndex).handler;
        const result = await userHandler(event, context);
        // validate user response and create the combined event
        const responseEvent = renderResponse(event, result);
        // submit to cfn as success
        await submitResponse('SUCCESS', responseEvent);
    }
    catch (e) {
        const resp = {
            ...event,
            Reason: exports.external.includeStackTraces ? e.stack : e.message,
        };
        if (!resp.PhysicalResourceId) {
            // special case: if CREATE fails, which usually implies, we usually don't
            // have a physical resource id. in this case, the subsequent DELETE
            // operation does not have any meaning, and will likely fail as well. to
            // address this, we use a marker so the provider framework can simply
            // ignore the subsequent DELETE.
            if (event.RequestType === 'Create') {
                exports.external.log('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
                resp.PhysicalResourceId = CREATE_FAILED_PHYSICAL_ID_MARKER;
            }
            else {
                // otherwise, if PhysicalResourceId is not specified, something is
                // terribly wrong because all other events should have an ID.
                exports.external.log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event)}`);
            }
        }
        // this is an actual error, fail the activity altogether and exist.
        await submitResponse('FAILED', resp);
    }
}
exports.handler = handler;
function renderResponse(cfnRequest, handlerResponse = {}) {
    var _a, _b;
    // if physical ID is not returned, we have some defaults for you based
    // on the request type.
    const physicalResourceId = (_b = (_a = handlerResponse.PhysicalResourceId) !== null && _a !== void 0 ? _a : cfnRequest.PhysicalResourceId) !== null && _b !== void 0 ? _b : cfnRequest.RequestId;
    // if we are in DELETE and physical ID was changed, it's an error.
    if (cfnRequest.RequestType === 'Delete' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
        throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${handlerResponse.PhysicalResourceId}" during deletion`);
    }
    // merge request event and result event (result prevails).
    return {
        ...cfnRequest,
        ...handlerResponse,
        PhysicalResourceId: physicalResourceId,
    };
}
async function submitResponse(status, event) {
    var _a;
    const json = {
        Status: status,
        Reason: (_a = event.Reason) !== null && _a !== void 0 ? _a : status,
        StackId: event.StackId,
        RequestId: event.RequestId,
        PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: event.NoEcho,
        Data: event.Data,
    };
    exports.external.log('submit response to cloudformation', json);
    const responseBody = JSON.stringify(json);
    const parsedUrl = url.parse(event.ResponseURL);
    const req = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: { 'content-type': '', 'content-length': responseBody.length },
    };
    await exports.external.sendHttpRequest(req, responseBody);
}
async function defaultSendHttpRequest(options, responseBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, _ => resolve());
            request.on('error', reject);
            request.write(responseBody);
            request.end();
        }
        catch (e) {
            reject(e);
        }
    });
}
function defaultLog(fmt, ...params) {
    // eslint-disable-next-line no-console
    console.log(fmt, ...params);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWVudHJ5cG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBRTNCLGlCQUFpQjtBQUNKLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxzQkFBc0I7SUFDdkMsR0FBRyxFQUFFLFVBQVU7SUFDZixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGdCQUFnQixFQUFFLFNBQVM7Q0FDNUIsQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQUcsd0RBQXdELENBQUM7QUFDbEcsTUFBTSwwQkFBMEIsR0FBRyw4REFBOEQsQ0FBQztBQVczRixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtELEVBQUUsT0FBMEI7SUFDMUcsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEQsdUVBQXVFO0lBQ3ZFLHVFQUF1RTtJQUN2RSxhQUFhO0lBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssZ0NBQWdDLEVBQUU7UUFDbkcsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN0RSxNQUFNLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTztLQUNSO0lBRUQsSUFBSTtRQUNGLHlFQUF5RTtRQUN6RSxpRUFBaUU7UUFDakUsd0NBQXdDO1FBQ3hDLGlFQUFpRTtRQUNqRSxNQUFNLFdBQVcsR0FBWSxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4RSxNQUFNLE1BQU0sR0FBRyxNQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakQsdURBQXVEO1FB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QUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsTUFBTSxFQUFFO0tBQ3ZFLENBQUM7SUFFRixNQUFNLGdCQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQsS0FBSyxVQUFVLHNCQUFzQixDQUFDLE9BQTZCLEVBQUUsWUFBb0I7SUFDdkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsR0FBVyxFQUFFLEdBQUcsTUFBYTtJQUMvQyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XG5cbi8vIGZvciB1bml0IHRlc3RzXG5leHBvcnQgY29uc3QgZXh0ZXJuYWwgPSB7XG4gIHNlbmRIdHRwUmVxdWVzdDogZGVmYXVsdFNlbmRIdHRwUmVxdWVzdCxcbiAgbG9nOiBkZWZhdWx0TG9nLFxuICBpbmNsdWRlU3RhY2tUcmFjZXM6IHRydWUsXG4gIHVzZXJIYW5kbGVySW5kZXg6ICcuL2luZGV4Jyxcbn07XG5cbmNvbnN0IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6Q1JFQVRFX0ZBSUxFRCc7XG5jb25zdCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6Ok1JU1NJTkdfUEhZU0lDQUxfSUQnO1xuXG5leHBvcnQgdHlwZSBSZXNwb25zZSA9IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQgJiBIYW5kbGVyUmVzcG9uc2U7XG5leHBvcnQgdHlwZSBIYW5kbGVyID0gKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkgPT4gUHJvbWlzZTxIYW5kbGVyUmVzcG9uc2UgfCB2b2lkPjtcbmV4cG9ydCB0eXBlIEhhbmRsZXJSZXNwb25zZSA9IHVuZGVmaW5lZCB8IHtcbiAgRGF0YT86IGFueTtcbiAgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nO1xuICBSZWFzb24/OiBzdHJpbmc7XG4gIE5vRWNobz86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgZXh0ZXJuYWwubG9nKEpTT04uc3RyaW5naWZ5KGV2ZW50LCB1bmRlZmluZWQsIDIpKTtcblxuICAvLyBpZ25vcmUgREVMRVRFIGV2ZW50IHdoZW4gdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGlzIHRoZSBtYXJrZXIgdGhhdFxuICAvLyBpbmRpY2F0ZXMgdGhhdCB0aGlzIERFTEVURSBpcyBhIHN1YnNlcXVlbnQgREVMRVRFIHRvIGEgZmFpbGVkIENSRUFURVxuICAvLyBvcGVyYXRpb24uXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkID09PSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUikge1xuICAgIGV4dGVybmFsLmxvZygnaWdub3JpbmcgREVMRVRFIGV2ZW50IGNhdXNlZCBieSBhIGZhaWxlZCBDUkVBVEUgZXZlbnQnKTtcbiAgICBhd2FpdCBzdWJtaXRSZXNwb25zZSgnU1VDQ0VTUycsIGV2ZW50KTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIC8vIGludm9rZSB0aGUgdXNlciBoYW5kbGVyLiB0aGlzIGlzIGludGVudGlvbmFsbHkgaW5zaWRlIHRoZSB0cnktY2F0Y2ggdG9cbiAgICAvLyBlbnN1cmUgdGhhdCBpZiB0aGVyZSBpcyBhbiBlcnJvciBpdCdzIHJlcG9ydGVkIGFzIGEgZmFpbHVyZSB0b1xuICAgIC8vIGNsb3VkZm9ybWF0aW9uIChvdGhlcndpc2UgY2ZuIHdhaXRzKS5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHVzZXJIYW5kbGVyOiBIYW5kbGVyID0gcmVxdWlyZShleHRlcm5hbC51c2VySGFuZGxlckluZGV4KS5oYW5kbGVyO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVzZXJIYW5kbGVyKGV2ZW50LCBjb250ZXh0KTtcblxuICAgIC8vIHZhbGlkYXRlIHVzZXIgcmVzcG9uc2UgYW5kIGNyZWF0ZSB0aGUgY29tYmluZWQgZXZlbnRcbiAgICBjb25zdCByZXNwb25zZUV2ZW50ID0gcmVuZGVyUmVzcG9uc2UoZXZlbnQsIHJlc3VsdCk7XG5cbiAgICAvLyBzdWJtaXQgdG8gY2ZuIGFzIHN1Y2Nlc3NcbiAgICBhd2FpdCBzdWJtaXRSZXNwb25zZSgnU1VDQ0VTUycsIHJlc3BvbnNlRXZlbnQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgcmVzcDogUmVzcG9uc2UgPSB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIFJlYXNvbjogZXh0ZXJuYWwuaW5jbHVkZVN0YWNrVHJhY2VzID8gZS5zdGFjayA6IGUubWVzc2FnZSxcbiAgICB9O1xuXG4gICAgaWYgKCFyZXNwLlBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBpZiBDUkVBVEUgZmFpbHMsIHdoaWNoIHVzdWFsbHkgaW1wbGllcywgd2UgdXN1YWxseSBkb24ndFxuICAgICAgLy8gaGF2ZSBhIHBoeXNpY2FsIHJlc291cmNlIGlkLiBpbiB0aGlzIGNhc2UsIHRoZSBzdWJzZXF1ZW50IERFTEVURVxuICAgICAgLy8gb3BlcmF0aW9uIGRvZXMgbm90IGhhdmUgYW55IG1lYW5pbmcsIGFuZCB3aWxsIGxpa2VseSBmYWlsIGFzIHdlbGwuIHRvXG4gICAgICAvLyBhZGRyZXNzIHRoaXMsIHdlIHVzZSBhIG1hcmtlciBzbyB0aGUgcHJvdmlkZXIgZnJhbWV3b3JrIGNhbiBzaW1wbHlcbiAgICAgIC8vIGlnbm9yZSB0aGUgc3Vic2VxdWVudCBERUxFVEUuXG4gICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgIGV4dGVybmFsLmxvZygnQ1JFQVRFIGZhaWxlZCwgcmVzcG9uZGluZyB3aXRoIGEgbWFya2VyIHBoeXNpY2FsIHJlc291cmNlIGlkIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgREVMRVRFIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgICByZXNwLlBoeXNpY2FsUmVzb3VyY2VJZCA9IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBQaHlzaWNhbFJlc291cmNlSWQgaXMgbm90IHNwZWNpZmllZCwgc29tZXRoaW5nIGlzXG4gICAgICAgIC8vIHRlcnJpYmx5IHdyb25nIGJlY2F1c2UgYWxsIG90aGVyIGV2ZW50cyBzaG91bGQgaGF2ZSBhbiBJRC5cbiAgICAgICAgZXh0ZXJuYWwubG9nKGBFUlJPUjogTWFsZm9ybWVkIGV2ZW50LiBcIlBoeXNpY2FsUmVzb3VyY2VJZFwiIGlzIHJlcXVpcmVkOiAke0pTT04uc3RyaW5naWZ5KGV2ZW50KX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIGFuIGFjdHVhbCBlcnJvciwgZmFpbCB0aGUgYWN0aXZpdHkgYWx0b2dldGhlciBhbmQgZXhpc3QuXG4gICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ0ZBSUxFRCcsIHJlc3ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclJlc3BvbnNlKFxuICBjZm5SZXF1ZXN0OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50ICYgeyBQaHlzaWNhbFJlc291cmNlSWQ/OiBzdHJpbmcgfSxcbiAgaGFuZGxlclJlc3BvbnNlOiB2b2lkIHwgSGFuZGxlclJlc3BvbnNlID0geyB9KTogUmVzcG9uc2Uge1xuXG4gIC8vIGlmIHBoeXNpY2FsIElEIGlzIG5vdCByZXR1cm5lZCwgd2UgaGF2ZSBzb21lIGRlZmF1bHRzIGZvciB5b3UgYmFzZWRcbiAgLy8gb24gdGhlIHJlcXVlc3QgdHlwZS5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gaGFuZGxlclJlc3BvbnNlLlBoeXNpY2FsUmVzb3VyY2VJZCA/PyBjZm5SZXF1ZXN0LlBoeXNpY2FsUmVzb3VyY2VJZCA/PyBjZm5SZXF1ZXN0LlJlcXVlc3RJZDtcblxuICAvLyBpZiB3ZSBhcmUgaW4gREVMRVRFIGFuZCBwaHlzaWNhbCBJRCB3YXMgY2hhbmdlZCwgaXQncyBhbiBlcnJvci5cbiAgaWYgKGNmblJlcXVlc3QuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIHBoeXNpY2FsUmVzb3VyY2VJZCAhPT0gY2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYERFTEVURTogY2Fubm90IGNoYW5nZSB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgZnJvbSBcIiR7Y2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWR9XCIgdG8gXCIke2hhbmRsZXJSZXNwb25zZS5QaHlzaWNhbFJlc291cmNlSWR9XCIgZHVyaW5nIGRlbGV0aW9uYCk7XG4gIH1cblxuICAvLyBtZXJnZSByZXF1ZXN0IGV2ZW50IGFuZCByZXN1bHQgZXZlbnQgKHJlc3VsdCBwcmV2YWlscykuXG4gIHJldHVybiB7XG4gICAgLi4uY2ZuUmVxdWVzdCxcbiAgICAuLi5oYW5kbGVyUmVzcG9uc2UsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN1Ym1pdFJlc3BvbnNlKHN0YXR1czogJ1NVQ0NFU1MnIHwgJ0ZBSUxFRCcsIGV2ZW50OiBSZXNwb25zZSkge1xuICBjb25zdCBqc29uOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVJlc3BvbnNlID0ge1xuICAgIFN0YXR1czogc3RhdHVzLFxuICAgIFJlYXNvbjogZXZlbnQuUmVhc29uID8/IHN0YXR1cyxcbiAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgIFJlcXVlc3RJZDogZXZlbnQuUmVxdWVzdElkLFxuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkIHx8IE1JU1NJTkdfUEhZU0lDQUxfSURfTUFSS0VSLFxuICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICBOb0VjaG86IGV2ZW50Lk5vRWNobyxcbiAgICBEYXRhOiBldmVudC5EYXRhLFxuICB9O1xuXG4gIGV4dGVybmFsLmxvZygnc3VibWl0IHJlc3BvbnNlIHRvIGNsb3VkZm9ybWF0aW9uJywganNvbik7XG5cbiAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoanNvbik7XG4gIGNvbnN0IHBhcnNlZFVybCA9IHVybC5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gIGNvbnN0IHJlcSA9IHtcbiAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczogeyAnY29udGVudC10eXBlJzogJycsICdjb250ZW50LWxlbmd0aCc6IHJlc3BvbnNlQm9keS5sZW5ndGggfSxcbiAgfTtcblxuICBhd2FpdCBleHRlcm5hbC5zZW5kSHR0cFJlcXVlc3QocmVxLCByZXNwb25zZUJvZHkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0U2VuZEh0dHBSZXF1ZXN0KG9wdGlvbnM6IGh0dHBzLlJlcXVlc3RPcHRpb25zLCByZXNwb25zZUJvZHk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCBfID0+IHJlc29sdmUoKSk7XG4gICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0TG9nKGZtdDogc3RyaW5nLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKGZtdCwgLi4ucGFyYW1zKTtcbn1cbiJdfQ==