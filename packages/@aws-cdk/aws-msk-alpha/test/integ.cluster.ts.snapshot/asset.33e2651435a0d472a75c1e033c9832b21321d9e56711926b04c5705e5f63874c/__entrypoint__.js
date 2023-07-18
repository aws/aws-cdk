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
    exports.external.log('submit response to cloudformation', json);
    const responseBody = JSON.stringify(json);
    const parsedUrl = url.parse(event.ResponseURL);
    const req = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: { 'content-type': '', 'content-length': responseBody.length },
    };
    const retryOptions = {
        attempts: 5,
        sleep: 1000,
    };
    await withRetries(retryOptions, exports.external.sendHttpRequest)(req, responseBody);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWVudHJ5cG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBRTNCLGlCQUFpQjtBQUNKLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxzQkFBc0I7SUFDdkMsR0FBRyxFQUFFLFVBQVU7SUFDZixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGdCQUFnQixFQUFFLFNBQVM7Q0FDNUIsQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQUcsd0RBQXdELENBQUM7QUFDbEcsTUFBTSwwQkFBMEIsR0FBRyw4REFBOEQsQ0FBQztBQVczRixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtELEVBQUUsT0FBMEI7SUFDMUcsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDeEQsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsdUVBQXVFO0lBQ3ZFLHVFQUF1RTtJQUN2RSxhQUFhO0lBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssZ0NBQWdDLEVBQUU7UUFDbkcsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN0RSxNQUFNLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTztLQUNSO0lBRUQsSUFBSTtRQUNGLHlFQUF5RTtRQUN6RSxpRUFBaUU7UUFDakUsd0NBQXdDO1FBQ3hDLGlFQUFpRTtRQUNqRSxNQUFNLFdBQVcsR0FBWSxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4RSxNQUFN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RUFBRSxFQUFFO1FBQ3hCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN2QixPQUFPLElBQUksRUFBRTtZQUNYLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ3hCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ25CLE1BQU0sQ0FBQyxDQUFDO2lCQUNUO2dCQUNELE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDVDtTQUNGO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWhCRCxrQ0FnQkM7QUFFRCxLQUFLLFVBQVUsS0FBSyxDQUFDLEVBQVU7SUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcblxuLy8gZm9yIHVuaXQgdGVzdHNcbmV4cG9ydCBjb25zdCBleHRlcm5hbCA9IHtcbiAgc2VuZEh0dHBSZXF1ZXN0OiBkZWZhdWx0U2VuZEh0dHBSZXF1ZXN0LFxuICBsb2c6IGRlZmF1bHRMb2csXG4gIGluY2x1ZGVTdGFja1RyYWNlczogdHJ1ZSxcbiAgdXNlckhhbmRsZXJJbmRleDogJy4vaW5kZXgnLFxufTtcblxuY29uc3QgQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpDUkVBVEVfRkFJTEVEJztcbmNvbnN0IE1JU1NJTkdfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6TUlTU0lOR19QSFlTSUNBTF9JRCc7XG5cbmV4cG9ydCB0eXBlIFJlc3BvbnNlID0gQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCAmIEhhbmRsZXJSZXNwb25zZTtcbmV4cG9ydCB0eXBlIEhhbmRsZXIgPSAoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSA9PiBQcm9taXNlPEhhbmRsZXJSZXNwb25zZSB8IHZvaWQ+O1xuZXhwb3J0IHR5cGUgSGFuZGxlclJlc3BvbnNlID0gdW5kZWZpbmVkIHwge1xuICBEYXRhPzogYW55O1xuICBQaHlzaWNhbFJlc291cmNlSWQ/OiBzdHJpbmc7XG4gIFJlYXNvbj86IHN0cmluZztcbiAgTm9FY2hvPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICBjb25zdCBzYW5pdGl6ZWRFdmVudCA9IHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9O1xuICBleHRlcm5hbC5sb2coSlNPTi5zdHJpbmdpZnkoc2FuaXRpemVkRXZlbnQsIHVuZGVmaW5lZCwgMikpO1xuXG4gIC8vIGlnbm9yZSBERUxFVEUgZXZlbnQgd2hlbiB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgaXMgdGhlIG1hcmtlciB0aGF0XG4gIC8vIGluZGljYXRlcyB0aGF0IHRoaXMgREVMRVRFIGlzIGEgc3Vic2VxdWVudCBERUxFVEUgdG8gYSBmYWlsZWQgQ1JFQVRFXG4gIC8vIG9wZXJhdGlvbi5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgPT09IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSKSB7XG4gICAgZXh0ZXJuYWwubG9nKCdpZ25vcmluZyBERUxFVEUgZXZlbnQgY2F1c2VkIGJ5IGEgZmFpbGVkIENSRUFURSBldmVudCcpO1xuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgZXZlbnQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gaW52b2tlIHRoZSB1c2VyIGhhbmRsZXIuIHRoaXMgaXMgaW50ZW50aW9uYWxseSBpbnNpZGUgdGhlIHRyeS1jYXRjaCB0b1xuICAgIC8vIGVuc3VyZSB0aGF0IGlmIHRoZXJlIGlzIGFuIGVycm9yIGl0J3MgcmVwb3J0ZWQgYXMgYSBmYWlsdXJlIHRvXG4gICAgLy8gY2xvdWRmb3JtYXRpb24gKG90aGVyd2lzZSBjZm4gd2FpdHMpLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgdXNlckhhbmRsZXI6IEhhbmRsZXIgPSByZXF1aXJlKGV4dGVybmFsLnVzZXJIYW5kbGVySW5kZXgpLmhhbmRsZXI7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXNlckhhbmRsZXIoc2FuaXRpemVkRXZlbnQsIGNvbnRleHQpO1xuXG4gICAgLy8gdmFsaWRhdGUgdXNlciByZXNwb25zZSBhbmQgY3JlYXRlIHRoZSBjb21iaW5lZCBldmVudFxuICAgIGNvbnN0IHJlc3BvbnNlRXZlbnQgPSByZW5kZXJSZXNwb25zZShldmVudCwgcmVzdWx0KTtcblxuICAgIC8vIHN1Ym1pdCB0byBjZm4gYXMgc3VjY2Vzc1xuICAgIGF3YWl0IHN1Ym1pdFJlc3BvbnNlKCdTVUNDRVNTJywgcmVzcG9uc2VFdmVudCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCByZXNwOiBSZXNwb25zZSA9IHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgUmVhc29uOiBleHRlcm5hbC5pbmNsdWRlU3RhY2tUcmFjZXMgPyBlLnN0YWNrIDogZS5tZXNzYWdlLFxuICAgIH07XG5cbiAgICBpZiAoIXJlc3AuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICAvLyBzcGVjaWFsIGNhc2U6IGlmIENSRUFURSBmYWlscywgd2hpY2ggdXN1YWxseSBpbXBsaWVzLCB3ZSB1c3VhbGx5IGRvbid0XG4gICAgICAvLyBoYXZlIGEgcGh5c2ljYWwgcmVzb3VyY2UgaWQuIGluIHRoaXMgY2FzZSwgdGhlIHN1YnNlcXVlbnQgREVMRVRFXG4gICAgICAvLyBvcGVyYXRpb24gZG9lcyBub3QgaGF2ZSBhbnkgbWVhbmluZywgYW5kIHdpbGwgbGlrZWx5IGZhaWwgYXMgd2VsbC4gdG9cbiAgICAgIC8vIGFkZHJlc3MgdGhpcywgd2UgdXNlIGEgbWFya2VyIHNvIHRoZSBwcm92aWRlciBmcmFtZXdvcmsgY2FuIHNpbXBseVxuICAgICAgLy8gaWdub3JlIHRoZSBzdWJzZXF1ZW50IERFTEVURS5cbiAgICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScpIHtcbiAgICAgICAgZXh0ZXJuYWwubG9nKCdDUkVBVEUgZmFpbGVkLCByZXNwb25kaW5nIHdpdGggYSBtYXJrZXIgcGh5c2ljYWwgcmVzb3VyY2UgaWQgc28gdGhhdCB0aGUgc3Vic2VxdWVudCBERUxFVEUgd2lsbCBiZSBpZ25vcmVkJyk7XG4gICAgICAgIHJlc3AuUGh5c2ljYWxSZXNvdXJjZUlkID0gQ1JFQVRFX0ZBSUxFRF9QSFlTSUNBTF9JRF9NQVJLRVI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBvdGhlcndpc2UsIGlmIFBoeXNpY2FsUmVzb3VyY2VJZCBpcyBub3Qgc3BlY2lmaWVkLCBzb21ldGhpbmcgaXNcbiAgICAgICAgLy8gdGVycmlibHkgd3JvbmcgYmVjYXVzZSBhbGwgb3RoZXIgZXZlbnRzIHNob3VsZCBoYXZlIGFuIElELlxuICAgICAgICBleHRlcm5hbC5sb2coYEVSUk9SOiBNYWxmb3JtZWQgZXZlbnQuIFwiUGh5c2ljYWxSZXNvdXJjZUlkXCIgaXMgcmVxdWlyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZXZlbnQpfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoaXMgaXMgYW4gYWN0dWFsIGVycm9yLCBmYWlsIHRoZSBhY3Rpdml0eSBhbHRvZ2V0aGVyIGFuZCBleGlzdC5cbiAgICBhd2FpdCBzdWJtaXRSZXNwb25zZSgnRkFJTEVEJywgcmVzcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUmVzcG9uc2UoXG4gIGNmblJlcXVlc3Q6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQgJiB7IFBoeXNpY2FsUmVzb3VyY2VJZD86IHN0cmluZyB9LFxuICBoYW5kbGVyUmVzcG9uc2U6IHZvaWQgfCBIYW5kbGVyUmVzcG9uc2UgPSB7IH0pOiBSZXNwb25zZSB7XG5cbiAgLy8gaWYgcGh5c2ljYWwgSUQgaXMgbm90IHJldHVybmVkLCB3ZSBoYXZlIHNvbWUgZGVmYXVsdHMgZm9yIHlvdSBiYXNlZFxuICAvLyBvbiB0aGUgcmVxdWVzdCB0eXBlLlxuICBjb25zdCBwaHlzaWNhbFJlc291cmNlSWQgPSBoYW5kbGVyUmVzcG9uc2UuUGh5c2ljYWxSZXNvdXJjZUlkID8/IGNmblJlcXVlc3QuUGh5c2ljYWxSZXNvdXJjZUlkID8/IGNmblJlcXVlc3QuUmVxdWVzdElkO1xuXG4gIC8vIGlmIHdlIGFyZSBpbiBERUxFVEUgYW5kIHBoeXNpY2FsIElEIHdhcyBjaGFuZ2VkLCBpdCdzIGFuIGVycm9yLlxuICBpZiAoY2ZuUmVxdWVzdC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgcGh5c2ljYWxSZXNvdXJjZUlkICE9PSBjZm5SZXF1ZXN0LlBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgREVMRVRFOiBjYW5ub3QgY2hhbmdlIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBJRCBmcm9tIFwiJHtjZm5SZXF1ZXN0LlBoeXNpY2FsUmVzb3VyY2VJZH1cIiB0byBcIiR7aGFuZGxlclJlc3BvbnNlLlBoeXNpY2FsUmVzb3VyY2VJZH1cIiBkdXJpbmcgZGVsZXRpb25gKTtcbiAgfVxuXG4gIC8vIG1lcmdlIHJlcXVlc3QgZXZlbnQgYW5kIHJlc3VsdCBldmVudCAocmVzdWx0IHByZXZhaWxzKS5cbiAgcmV0dXJuIHtcbiAgICAuLi5jZm5SZXF1ZXN0LFxuICAgIC4uLmhhbmRsZXJSZXNwb25zZSxcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3VibWl0UmVzcG9uc2Uoc3RhdHVzOiAnU1VDQ0VTUycgfCAnRkFJTEVEJywgZXZlbnQ6IFJlc3BvbnNlKSB7XG4gIGNvbnN0IGpzb246IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlUmVzcG9uc2UgPSB7XG4gICAgU3RhdHVzOiBzdGF0dXMsXG4gICAgUmVhc29uOiBldmVudC5SZWFzb24gPz8gc3RhdHVzLFxuICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgfHwgTUlTU0lOR19QSFlTSUNBTF9JRF9NQVJLRVIsXG4gICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgIE5vRWNobzogZXZlbnQuTm9FY2hvLFxuICAgIERhdGE6IGV2ZW50LkRhdGEsXG4gIH07XG5cbiAgZXh0ZXJuYWwubG9nKCdzdWJtaXQgcmVzcG9uc2UgdG8gY2xvdWRmb3JtYXRpb24nLCBqc29uKTtcblxuICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeShqc29uKTtcbiAgY29uc3QgcGFyc2VkVXJsID0gdXJsLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgY29uc3QgcmVxID0ge1xuICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnJywgJ2NvbnRlbnQtbGVuZ3RoJzogcmVzcG9uc2VCb2R5Lmxlbmd0aCB9LFxuICB9O1xuXG4gIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHtcbiAgICBhdHRlbXB0czogNSxcbiAgICBzbGVlcDogMTAwMCxcbiAgfTtcbiAgYXdhaXQgd2l0aFJldHJpZXMocmV0cnlPcHRpb25zLCBleHRlcm5hbC5zZW5kSHR0cFJlcXVlc3QpKHJlcSwgcmVzcG9uc2VCb2R5KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdFNlbmRIdHRwUmVxdWVzdChvcHRpb25zOiBodHRwcy5SZXF1ZXN0T3B0aW9ucywgcmVzcG9uc2VCb2R5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgXyA9PiByZXNvbHZlKCkpO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdExvZyhmbXQ6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyhmbXQsIC4uLnBhcmFtcyk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmV0cnlPcHRpb25zIHtcbiAgLyoqIEhvdyBtYW55IHJldHJpZXMgKHdpbGwgYXQgbGVhc3QgdHJ5IG9uY2UpICovXG4gIHJlYWRvbmx5IGF0dGVtcHRzOiBudW1iZXI7XG4gIC8qKiBTbGVlcCBiYXNlLCBpbiBtcyAqL1xuICByZWFkb25seSBzbGVlcDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJldHJpZXM8QSBleHRlbmRzIEFycmF5PGFueT4sIEI+KG9wdGlvbnM6IFJldHJ5T3B0aW9ucywgZm46ICguLi54czogQSkgPT4gUHJvbWlzZTxCPik6ICguLi54czogQSkgPT4gUHJvbWlzZTxCPiB7XG4gIHJldHVybiBhc3luYyAoLi4ueHM6IEEpID0+IHtcbiAgICBsZXQgYXR0ZW1wdHMgPSBvcHRpb25zLmF0dGVtcHRzO1xuICAgIGxldCBtcyA9IG9wdGlvbnMuc2xlZXA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmbiguLi54cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChhdHRlbXB0cy0tIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHNsZWVwKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1zKSk7XG4gICAgICAgIG1zICo9IDI7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgob2spID0+IHNldFRpbWVvdXQob2ssIG1zKSk7XG59Il19