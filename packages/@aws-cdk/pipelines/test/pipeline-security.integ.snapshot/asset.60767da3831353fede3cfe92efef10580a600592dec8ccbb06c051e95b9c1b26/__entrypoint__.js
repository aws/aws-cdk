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
    const sanitizedEvent = { ...event, ResponseURL: '...' };
    exports.external.log(JSON.stringify(sanitizedEvent, undefined, 2));
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
        const result = await userHandler(sanitizedEvent, context);
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
    // if physical ID is not returned, we have some defaults for you based
    // on the request type.
    const physicalResourceId = handlerResponse.PhysicalResourceId ?? cfnRequest.PhysicalResourceId ?? cfnRequest.RequestId;
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
    const json = {
        Status: status,
        Reason: event.Reason ?? status,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWVudHJ5cG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBRTNCLGlCQUFpQjtBQUNKLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxzQkFBc0I7SUFDdkMsR0FBRyxFQUFFLFVBQVU7SUFDZixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGdCQUFnQixFQUFFLFNBQVM7Q0FDNUIsQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQUcsd0RBQXdELENBQUM7QUFDbEcsTUFBTSwwQkFBMEIsR0FBRyw4REFBOEQsQ0FBQztBQVczRixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtELEVBQUUsT0FBMEI7SUFDMUcsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDeEQsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsdUVBQXVFO0lBQ3ZFLHVFQUF1RTtJQUN2RSxhQUFhO0lBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssZ0NBQWdDLEVBQUU7UUFDbkcsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN0RSxNQUFNLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTztLQUNSO0lBRUQsSUFBSTtRQUNGLHlFQUF5RTtRQUN6RSxpRUFBaUU7UUFDakUsd0NBQXdDO1FBQ3hDLGlFQUFpRTtRQUNqRSxNQUFNLFdBQVcsR0FBWSxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4RSxNQUFN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QzVCLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtRQUNwQixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRTtLQUN2RSxDQUFDO0lBRUYsTUFBTSxnQkFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVELEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxPQUE2QixFQUFFLFlBQW9CO0lBQ3ZGLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN2RCxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDWDtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLEdBQVcsRUFBRSxHQUFHLE1BQWE7SUFDL0Msc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuXG4vLyBmb3IgdW5pdCB0ZXN0c1xuZXhwb3J0IGNvbnN0IGV4dGVybmFsID0ge1xuICBzZW5kSHR0cFJlcXVlc3Q6IGRlZmF1bHRTZW5kSHR0cFJlcXVlc3QsXG4gIGxvZzogZGVmYXVsdExvZyxcbiAgaW5jbHVkZVN0YWNrVHJhY2VzOiB0cnVlLFxuICB1c2VySGFuZGxlckluZGV4OiAnLi9pbmRleCcsXG59O1xuXG5jb25zdCBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUiA9ICdBV1NDREs6OkN1c3RvbVJlc291cmNlUHJvdmlkZXJGcmFtZXdvcms6OkNSRUFURV9GQUlMRUQnO1xuY29uc3QgTUlTU0lOR19QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpNSVNTSU5HX1BIWVNJQ0FMX0lEJztcblxuZXhwb3J0IHR5cGUgUmVzcG9uc2UgPSBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50ICYgSGFuZGxlclJlc3BvbnNlO1xuZXhwb3J0IHR5cGUgSGFuZGxlciA9IChldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpID0+IFByb21pc2U8SGFuZGxlclJlc3BvbnNlIHwgdm9pZD47XG5leHBvcnQgdHlwZSBIYW5kbGVyUmVzcG9uc2UgPSB1bmRlZmluZWQgfCB7XG4gIERhdGE/OiBhbnk7XG4gIFBoeXNpY2FsUmVzb3VyY2VJZD86IHN0cmluZztcbiAgUmVhc29uPzogc3RyaW5nO1xuICBOb0VjaG8/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIGNvbnN0IHNhbml0aXplZEV2ZW50ID0geyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH07XG4gIGV4dGVybmFsLmxvZyhKU09OLnN0cmluZ2lmeShzYW5pdGl6ZWRFdmVudCwgdW5kZWZpbmVkLCAyKSk7XG5cbiAgLy8gaWdub3JlIERFTEVURSBldmVudCB3aGVuIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBJRCBpcyB0aGUgbWFya2VyIHRoYXRcbiAgLy8gaW5kaWNhdGVzIHRoYXQgdGhpcyBERUxFVEUgaXMgYSBzdWJzZXF1ZW50IERFTEVURSB0byBhIGZhaWxlZCBDUkVBVEVcbiAgLy8gb3BlcmF0aW9uLlxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCA9PT0gQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIpIHtcbiAgICBleHRlcm5hbC5sb2coJ2lnbm9yaW5nIERFTEVURSBldmVudCBjYXVzZWQgYnkgYSBmYWlsZWQgQ1JFQVRFIGV2ZW50Jyk7XG4gICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCBldmVudCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBpbnZva2UgdGhlIHVzZXIgaGFuZGxlci4gdGhpcyBpcyBpbnRlbnRpb25hbGx5IGluc2lkZSB0aGUgdHJ5LWNhdGNoIHRvXG4gICAgLy8gZW5zdXJlIHRoYXQgaWYgdGhlcmUgaXMgYW4gZXJyb3IgaXQncyByZXBvcnRlZCBhcyBhIGZhaWx1cmUgdG9cbiAgICAvLyBjbG91ZGZvcm1hdGlvbiAob3RoZXJ3aXNlIGNmbiB3YWl0cykuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICBjb25zdCB1c2VySGFuZGxlcjogSGFuZGxlciA9IHJlcXVpcmUoZXh0ZXJuYWwudXNlckhhbmRsZXJJbmRleCkuaGFuZGxlcjtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB1c2VySGFuZGxlcihzYW5pdGl6ZWRFdmVudCwgY29udGV4dCk7XG5cbiAgICAvLyB2YWxpZGF0ZSB1c2VyIHJlc3BvbnNlIGFuZCBjcmVhdGUgdGhlIGNvbWJpbmVkIGV2ZW50XG4gICAgY29uc3QgcmVzcG9uc2VFdmVudCA9IHJlbmRlclJlc3BvbnNlKGV2ZW50LCByZXN1bHQpO1xuXG4gICAgLy8gc3VibWl0IHRvIGNmbiBhcyBzdWNjZXNzXG4gICAgYXdhaXQgc3VibWl0UmVzcG9uc2UoJ1NVQ0NFU1MnLCByZXNwb25zZUV2ZW50KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IHJlc3A6IFJlc3BvbnNlID0ge1xuICAgICAgLi4uZXZlbnQsXG4gICAgICBSZWFzb246IGV4dGVybmFsLmluY2x1ZGVTdGFja1RyYWNlcyA/IGUuc3RhY2sgOiBlLm1lc3NhZ2UsXG4gICAgfTtcblxuICAgIGlmICghcmVzcC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogaWYgQ1JFQVRFIGZhaWxzLCB3aGljaCB1c3VhbGx5IGltcGxpZXMsIHdlIHVzdWFsbHkgZG9uJ3RcbiAgICAgIC8vIGhhdmUgYSBwaHlzaWNhbCByZXNvdXJjZSBpZC4gaW4gdGhpcyBjYXNlLCB0aGUgc3Vic2VxdWVudCBERUxFVEVcbiAgICAgIC8vIG9wZXJhdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBtZWFuaW5nLCBhbmQgd2lsbCBsaWtlbHkgZmFpbCBhcyB3ZWxsLiB0b1xuICAgICAgLy8gYWRkcmVzcyB0aGlzLCB3ZSB1c2UgYSBtYXJrZXIgc28gdGhlIHByb3ZpZGVyIGZyYW1ld29yayBjYW4gc2ltcGx5XG4gICAgICAvLyBpZ25vcmUgdGhlIHN1YnNlcXVlbnQgREVMRVRFLlxuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICBleHRlcm5hbC5sb2coJ0NSRUFURSBmYWlsZWQsIHJlc3BvbmRpbmcgd2l0aCBhIG1hcmtlciBwaHlzaWNhbCByZXNvdXJjZSBpZCBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IERFTEVURSB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgICAgcmVzcC5QaHlzaWNhbFJlc291cmNlSWQgPSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG90aGVyd2lzZSwgaWYgUGh5c2ljYWxSZXNvdXJjZUlkIGlzIG5vdCBzcGVjaWZpZWQsIHNvbWV0aGluZyBpc1xuICAgICAgICAvLyB0ZXJyaWJseSB3cm9uZyBiZWNhdXNlIGFsbCBvdGhlciBldmVudHMgc2hvdWxkIGhhdmUgYW4gSUQuXG4gICAgICAgIGV4dGVybmFsLmxvZyhgRVJST1I6IE1hbGZvcm1lZCBldmVudC4gXCJQaHlzaWNhbFJlc291cmNlSWRcIiBpcyByZXF1aXJlZDogJHtKU09OLnN0cmluZ2lmeShldmVudCl9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBhbiBhY3R1YWwgZXJyb3IsIGZhaWwgdGhlIGFjdGl2aXR5IGFsdG9nZXRoZXIgYW5kIGV4aXN0LlxuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCByZXNwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJSZXNwb25zZShcbiAgY2ZuUmVxdWVzdDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCAmIHsgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nIH0sXG4gIGhhbmRsZXJSZXNwb25zZTogdm9pZCB8IEhhbmRsZXJSZXNwb25zZSA9IHsgfSk6IFJlc3BvbnNlIHtcblxuICAvLyBpZiBwaHlzaWNhbCBJRCBpcyBub3QgcmV0dXJuZWQsIHdlIGhhdmUgc29tZSBkZWZhdWx0cyBmb3IgeW91IGJhc2VkXG4gIC8vIG9uIHRoZSByZXF1ZXN0IHR5cGUuXG4gIGNvbnN0IHBoeXNpY2FsUmVzb3VyY2VJZCA9IGhhbmRsZXJSZXNwb25zZS5QaHlzaWNhbFJlc291cmNlSWQgPz8gY2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWQgPz8gY2ZuUmVxdWVzdC5SZXF1ZXN0SWQ7XG5cbiAgLy8gaWYgd2UgYXJlIGluIERFTEVURSBhbmQgcGh5c2ljYWwgSUQgd2FzIGNoYW5nZWQsIGl0J3MgYW4gZXJyb3IuXG4gIGlmIChjZm5SZXF1ZXN0LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBwaHlzaWNhbFJlc291cmNlSWQgIT09IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBERUxFVEU6IGNhbm5vdCBjaGFuZ2UgdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGZyb20gXCIke2NmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIHRvIFwiJHtoYW5kbGVyUmVzcG9uc2UuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIGR1cmluZyBkZWxldGlvbmApO1xuICB9XG5cbiAgLy8gbWVyZ2UgcmVxdWVzdCBldmVudCBhbmQgcmVzdWx0IGV2ZW50IChyZXN1bHQgcHJldmFpbHMpLlxuICByZXR1cm4ge1xuICAgIC4uLmNmblJlcXVlc3QsXG4gICAgLi4uaGFuZGxlclJlc3BvbnNlLFxuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdWJtaXRSZXNwb25zZShzdGF0dXM6ICdTVUNDRVNTJyB8ICdGQUlMRUQnLCBldmVudDogUmVzcG9uc2UpIHtcbiAgY29uc3QganNvbjogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VSZXNwb25zZSA9IHtcbiAgICBTdGF0dXM6IHN0YXR1cyxcbiAgICBSZWFzb246IGV2ZW50LlJlYXNvbiA/PyBzdGF0dXMsXG4gICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB8fCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUixcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgTm9FY2hvOiBldmVudC5Ob0VjaG8sXG4gICAgRGF0YTogZXZlbnQuRGF0YSxcbiAgfTtcblxuICBleHRlcm5hbC5sb2coJ3N1Ym1pdCByZXNwb25zZSB0byBjbG91ZGZvcm1hdGlvbicsIGpzb24pO1xuXG4gIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KGpzb24pO1xuICBjb25zdCBwYXJzZWRVcmwgPSB1cmwucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICBjb25zdCByZXEgPSB7XG4gICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIGhlYWRlcnM6IHsgJ2NvbnRlbnQtdHlwZSc6ICcnLCAnY29udGVudC1sZW5ndGgnOiByZXNwb25zZUJvZHkubGVuZ3RoIH0sXG4gIH07XG5cbiAgYXdhaXQgZXh0ZXJuYWwuc2VuZEh0dHBSZXF1ZXN0KHJlcSwgcmVzcG9uc2VCb2R5KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdFNlbmRIdHRwUmVxdWVzdChvcHRpb25zOiBodHRwcy5SZXF1ZXN0T3B0aW9ucywgcmVzcG9uc2VCb2R5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgXyA9PiByZXNvbHZlKCkpO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdExvZyhmbXQ6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyhmbXQsIC4uLnBhcmFtcyk7XG59XG4iXX0=