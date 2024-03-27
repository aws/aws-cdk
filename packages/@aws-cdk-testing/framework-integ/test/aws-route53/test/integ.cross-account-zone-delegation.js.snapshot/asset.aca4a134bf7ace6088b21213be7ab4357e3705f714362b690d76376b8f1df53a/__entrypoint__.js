"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetries = exports.handler = exports.external = void 0;
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
    const parsedUrl = url.parse(event.ResponseURL);
    const loggingSafeUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/${parsedUrl.pathname}?***`;
    exports.external.log('submit response to cloudformation', loggingSafeUrl, json);
    const responseBody = JSON.stringify(json);
    const req = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': Buffer.byteLength(responseBody, 'utf8'),
        },
    };
    const retryOptions = {
        attempts: 5,
        sleep: 1000,
    };
    await withRetries(retryOptions, exports.external.sendHttpRequest)(req, responseBody);
}
async function defaultSendHttpRequest(options, requestBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, (response) => {
                response.resume(); // Consume the response but don't care about it
                if (!response.statusCode || response.statusCode >= 400) {
                    reject(new Error(`Unsuccessful HTTP response: ${response.statusCode}`));
                }
                else {
                    resolve();
                }
            });
            request.on('error', reject);
            request.write(requestBody);
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
function withRetries(options, fn) {
    return async (...xs) => {
        let attempts = options.attempts;
        let ms = options.sleep;
        while (true) {
            try {
                return await fn(...xs);
            }
            catch (e) {
                if (attempts-- <= 0) {
                    throw e;
                }
                await sleep(Math.floor(Math.random() * ms));
                ms *= 2;
            }
        }
    };
}
exports.withRetries = withRetries;
async function sleep(ms) {
    return new Promise((ok) => setTimeout(ok, ms));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBRTNCLGlCQUFpQjtBQUNKLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxzQkFBc0I7SUFDdkMsR0FBRyxFQUFFLFVBQVU7SUFDZixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGdCQUFnQixFQUFFLFNBQVM7Q0FDNUIsQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQUcsd0RBQXdELENBQUM7QUFDbEcsTUFBTSwwQkFBMEIsR0FBRyw4REFBOEQsQ0FBQztBQVczRixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtELEVBQUUsT0FBMEI7SUFDMUcsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDeEQsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsdUVBQXVFO0lBQ3ZFLHVFQUF1RTtJQUN2RSxhQUFhO0lBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssZ0NBQWdDLEVBQUU7UUFDbkcsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN0RSxNQUFNLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTztLQUNSO0lBRUQsSUFBSTtRQUNGLHlFQUF5RTtRQUN6RSxpRUFBaUU7UUFDakUsd0NBQXdDO1FBQ3hDLGlFQUFpRTtRQUNqRSxNQUFNLFdBQVcsR0FBWSxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4RSxNQUFNLE1BQU0sR0FBRyxNQUFNLFdBQVcsQ0FB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bXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcblxuLy8gZm9yIHVuaXQgdGVzdHNcbmV4cG9ydCBjb25zdCBleHRlcm5hbCA9IHtcbiAgc2VuZEh0dHBSZXF1ZXN0OiBkZWZhdWx0U2VuZEh0dHBSZXF1ZXN0LFxuICBsb2c6IGRlZmF1bHRMb2csXG4gIGluY2x1ZGVTdGFja1RyYWNlczogdHJ1ZSxcbiAgdXNlckhhbmRsZXJJbmRleDogJy4vaW5kZXgnLFxufTtcblxuY29uc3QgQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpDUkVBVEVfRkFJTEVEJztcbmNvbnN0IE1JU1NJTkdfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6TUlTU0lOR19QSFlTSUNBTF9JRCc7XG5cbmV4cG9ydCB0eXBlIFJlc3BvbnNlID0gQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCAmIEhhbmRsZXJSZXNwb25zZTtcbmV4cG9ydCB0eXBlIEhhbmRsZXIgPSAoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSA9PiBQcm9taXNlPEhhbmRsZXJSZXNwb25zZSB8IHZvaWQ+O1xuZXhwb3J0IHR5cGUgSGFuZGxlclJlc3BvbnNlID0gdW5kZWZpbmVkIHwge1xuICBEYXRhPzogYW55O1xuICBQaHlzaWNhbFJlc291cmNlSWQ/OiBzdHJpbmc7XG4gIFJlYXNvbj86IHN0cmluZztcbiAgTm9FY2hvPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICBjb25zdCBzYW5pdGl6ZWRFdmVudCA9IHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9O1xuICBleHRlcm5hbC5sb2coSlNPTi5zdHJpbmdpZnkoc2FuaXRpemVkRXZlbnQsIHVuZGVmaW5lZCwgMikpO1xuXG4gIC8vIGlnbm9yZSBERUxFVEUgZXZlbnQgd2hlbiB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgaXMgdGhlIG1hcmtlciB0aGF0XG4gIC8vIGluZGljYXRlcyB0aGF0IHRoaXMgREVMRVRFIGlzIGEgc3Vic2VxdWVudCBERUxFVEUgdG8gYSBmYWlsZWQgQ1JFQVRFXG4gIC8vIG9wZXJhdGlvbi5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgPT09IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSKSB7XG4gICAgZXh0ZXJuYWwubG9nKCdpZ25vcmluZyBERUxFVEUgZXZlbnQgY2F1c2VkIGJ5IGEgZmFpbGVkIENSRUFURSBldmVudCcpO1xuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgZXZlbnQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gaW52b2tlIHRoZSB1c2VyIGhhbmRsZXIuIHRoaXMgaXMgaW50ZW50aW9uYWxseSBpbnNpZGUgdGhlIHRyeS1jYXRjaCB0b1xuICAgIC8vIGVuc3VyZSB0aGF0IGlmIHRoZXJlIGlzIGFuIGVycm9yIGl0J3MgcmVwb3J0ZWQgYXMgYSBmYWlsdXJlIHRvXG4gICAgLy8gY2xvdWRmb3JtYXRpb24gKG90aGVyd2lzZSBjZm4gd2FpdHMpLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgdXNlckhhbmRsZXI6IEhhbmRsZXIgPSByZXF1aXJlKGV4dGVybmFsLnVzZXJIYW5kbGVySW5kZXgpLmhhbmRsZXI7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXNlckhhbmRsZXIoc2FuaXRpemVkRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgLy8gdmFsaWRhdGUgdXNlciByZXNwb25zZSBhbmQgY3JlYXRlIHRoZSBjb21iaW5lZCBldmVudFxuICAgIGNvbnN0IHJlc3BvbnNlRXZlbnQgPSByZW5kZXJSZXNwb25zZShldmVudCwgcmVzdWx0KTtcblxuICAgIC8vIHN1Ym1pdCB0byBjZm4gYXMgc3VjY2Vzc1xuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgcmVzcG9uc2VFdmVudCk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnN0IHJlc3A6IFJlc3BvbnNlID0ge1xuICAgICAgLi4uZXZlbnQsXG4gICAgICBSZWFzb246IGV4dGVybmFsLmluY2x1ZGVTdGFja1RyYWNlcyA/IGUuc3RhY2sgOiBlLm1lc3NhZ2UsXG4gICAgfTtcblxuICAgIGlmICghcmVzcC5QaHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogaWYgQ1JFQVRFIGZhaWxzLCB3aGljaCB1c3VhbGx5IGltcGxpZXMsIHdlIHVzdWFsbHkgZG9uJ3RcbiAgICAgIC8vIGhhdmUgYSBwaHlzaWNhbCByZXNvdXJjZSBpZC4gaW4gdGhpcyBjYXNlLCB0aGUgc3Vic2VxdWVudCBERUxFVEVcbiAgICAgIC8vIG9wZXJhdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBtZWFuaW5nLCBhbmQgd2lsbCBsaWtlbHkgZmFpbCBhcyB3ZWxsLiB0b1xuICAgICAgLy8gYWRkcmVzcyB0aGlzLCB3ZSB1c2UgYSBtYXJrZXIgc28gdGhlIHByb3ZpZGVyIGZyYW1ld29yayBjYW4gc2ltcGx5XG4gICAgICAvLyBpZ25vcmUgdGhlIHN1YnNlcXVlbnQgREVMRVRFLlxuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICBleHRlcm5hbC5sb2coJ0NSRUFURSBmYWlsZWQsIHJlc3BvbmRpbmcgd2l0aCBhIG1hcmtlciBwaHlzaWNhbCByZXNvdXJjZSBpZCBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IERFTEVURSB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgICAgcmVzcC5QaHlzaWNhbFJlc291cmNlSWQgPSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG90aGVyd2lzZSwgaWYgUGh5c2ljYWxSZXNvdXJjZUlkIGlzIG5vdCBzcGVjaWZpZWQsIHNvbWV0aGluZyBpc1xuICAgICAgICAvLyB0ZXJyaWJseSB3cm9uZyBiZWNhdXNlIGFsbCBvdGhlciBldmVudHMgc2hvdWxkIGhhdmUgYW4gSUQuXG4gICAgICAgIGV4dGVybmFsLmxvZyhgRVJST1I6IE1hbGZvcm1lZCBldmVudC4gXCJQaHlzaWNhbFJlc291cmNlSWRcIiBpcyByZXF1aXJlZDogJHtKU09OLnN0cmluZ2lmeShldmVudCl9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBhbiBhY3R1YWwgZXJyb3IsIGZhaWwgdGhlIGFjdGl2aXR5IGFsdG9nZXRoZXIgYW5kIGV4aXN0LlxuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdGQUlMRUQnLCByZXNwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJSZXNwb25zZShcbiAgY2ZuUmVxdWVzdDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCAmIHsgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nIH0sXG4gIGhhbmRsZXJSZXNwb25zZTogdm9pZCB8IEhhbmRsZXJSZXNwb25zZSA9IHsgfSk6IFJlc3BvbnNlIHtcblxuICAvLyBpZiBwaHlzaWNhbCBJRCBpcyBub3QgcmV0dXJuZWQsIHdlIGhhdmUgc29tZSBkZWZhdWx0cyBmb3IgeW91IGJhc2VkXG4gIC8vIG9uIHRoZSByZXF1ZXN0IHR5cGUuXG4gIGNvbnN0IHBoeXNpY2FsUmVzb3VyY2VJZCA9IGhhbmRsZXJSZXNwb25zZS5QaHlzaWNhbFJlc291cmNlSWQgPz8gY2ZuUmVxdWVzdC5QaHlzaWNhbFJlc291cmNlSWQgPz8gY2ZuUmVxdWVzdC5SZXF1ZXN0SWQ7XG5cbiAgLy8gaWYgd2UgYXJlIGluIERFTEVURSBhbmQgcGh5c2ljYWwgSUQgd2FzIGNoYW5nZWQsIGl0J3MgYW4gZXJyb3IuXG4gIGlmIChjZm5SZXF1ZXN0LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBwaHlzaWNhbFJlc291cmNlSWQgIT09IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBERUxFVEU6IGNhbm5vdCBjaGFuZ2UgdGhlIHBoeXNpY2FsIHJlc291cmNlIElEIGZyb20gXCIke2NmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIHRvIFwiJHtoYW5kbGVyUmVzcG9uc2UuUGh5c2ljYWxSZXNvdXJjZUlkfVwiIGR1cmluZyBkZWxldGlvbmApO1xuICB9XG5cbiAgLy8gbWVyZ2UgcmVxdWVzdCBldmVudCBhbmQgcmVzdWx0IGV2ZW50IChyZXN1bHQgcHJldmFpbHMpLlxuICByZXR1cm4ge1xuICAgIC4uLmNmblJlcXVlc3QsXG4gICAgLi4uaGFuZGxlclJlc3BvbnNlLFxuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdWJtaXRSZXNwb25zZShzdGF0dXM6ICdTVUNDRVNTJyB8ICdGQUlMRUQnLCBldmVudDogUmVzcG9uc2UpIHtcbiAgY29uc3QganNvbjogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VSZXNwb25zZSA9IHtcbiAgICBTdGF0dXM6IHN0YXR1cyxcbiAgICBSZWFzb246IGV2ZW50LlJlYXNvbiA/PyBzdGF0dXMsXG4gICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB8fCBNSVNTSU5HX1BIWVNJQ0FMX0lEX01BUktFUixcbiAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgTm9FY2hvOiBldmVudC5Ob0VjaG8sXG4gICAgRGF0YTogZXZlbnQuRGF0YSxcbiAgfTtcblxuICBjb25zdCBwYXJzZWRVcmwgPSB1cmwucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICBjb25zdCBsb2dnaW5nU2FmZVVybCA9IGAke3BhcnNlZFVybC5wcm90b2NvbH0vLyR7cGFyc2VkVXJsLmhvc3RuYW1lfS8ke3BhcnNlZFVybC5wYXRobmFtZX0/KioqYDtcbiAgZXh0ZXJuYWwubG9nKCdzdWJtaXQgcmVzcG9uc2UgdG8gY2xvdWRmb3JtYXRpb24nLCBsb2dnaW5nU2FmZVVybCwganNvbik7XG5cbiAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoanNvbik7XG4gIGNvbnN0IHJlcSA9IHtcbiAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogQnVmZmVyLmJ5dGVMZW5ndGgocmVzcG9uc2VCb2R5LCAndXRmOCcpLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmV0cnlPcHRpb25zID0ge1xuICAgIGF0dGVtcHRzOiA1LFxuICAgIHNsZWVwOiAxMDAwLFxuICB9O1xuICBhd2FpdCB3aXRoUmV0cmllcyhyZXRyeU9wdGlvbnMsIGV4dGVybmFsLnNlbmRIdHRwUmVxdWVzdCkocmVxLCByZXNwb25zZUJvZHkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0U2VuZEh0dHBSZXF1ZXN0KG9wdGlvbnM6IGh0dHBzLlJlcXVlc3RPcHRpb25zLCByZXF1ZXN0Qm9keTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXNwb25zZS5yZXN1bWUoKTsgLy8gQ29uc3VtZSB0aGUgcmVzcG9uc2UgYnV0IGRvbid0IGNhcmUgYWJvdXQgaXRcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgVW5zdWNjZXNzZnVsIEhUVFAgcmVzcG9uc2U6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIHJlcXVlc3Qud3JpdGUocmVxdWVzdEJvZHkpO1xuICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdExvZyhmbXQ6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyhmbXQsIC4uLnBhcmFtcyk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmV0cnlPcHRpb25zIHtcbiAgLyoqIEhvdyBtYW55IHJldHJpZXMgKHdpbGwgYXQgbGVhc3QgdHJ5IG9uY2UpICovXG4gIHJlYWRvbmx5IGF0dGVtcHRzOiBudW1iZXI7XG4gIC8qKiBTbGVlcCBiYXNlLCBpbiBtcyAqL1xuICByZWFkb25seSBzbGVlcDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJldHJpZXM8QSBleHRlbmRzIEFycmF5PGFueT4sIEI+KG9wdGlvbnM6IFJldHJ5T3B0aW9ucywgZm46ICguLi54czogQSkgPT4gUHJvbWlzZTxCPik6ICguLi54czogQSkgPT4gUHJvbWlzZTxCPiB7XG4gIHJldHVybiBhc3luYyAoLi4ueHM6IEEpID0+IHtcbiAgICBsZXQgYXR0ZW1wdHMgPSBvcHRpb25zLmF0dGVtcHRzO1xuICAgIGxldCBtcyA9IG9wdGlvbnMuc2xlZXA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmbiguLi54cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhdHRlbXB0cy0tIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHNsZWVwKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1zKSk7XG4gICAgICAgIG1zICo9IDI7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgob2spID0+IHNldFRpbWVvdXQob2ssIG1zKSk7XG59XG4iXX0=