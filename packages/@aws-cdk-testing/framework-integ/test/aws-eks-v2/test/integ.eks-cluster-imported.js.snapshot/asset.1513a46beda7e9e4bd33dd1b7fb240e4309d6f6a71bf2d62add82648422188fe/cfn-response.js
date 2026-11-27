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
    // NoEcho is set if either the caller or the event says so. A FAILED response for
    // an isComplete request (submitted by safeHandler) does not pass the option, but
    // the request still carries the Data returned by onEvent. The check is for
    // truthiness, not `=== true`: a handler written in another language, or one that
    // builds its JSON by hand, can return `"true"` or `1`, which CloudFormation and
    // the framework have always honored. The same value decides both the response
    // body and the log line.
    const noEcho = Boolean(options.noEcho) || Boolean(event.NoEcho);
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
                    (0, util_1.log)(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event.NoEcho ? redactDataFromPayload(sanitizedEvent) : sanitizedEvent)}`);
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
 * `core/nodejs-entrypoint-handler/index.ts`), which cannot import it.
 * `custom-resources/test/provider-framework/redact-data-parity.test.ts` runs all
 * three on the same inputs.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSx3Q0EyQ0M7QUFJRCxrQ0EyQ0M7QUFhRCxzREFlQztBQTdJRCx5Q0FBMkI7QUFDM0IseUNBQXlDO0FBQ3pDLGlDQUEwQztBQUc3QixRQUFBLGdDQUFnQyxHQUFHLHdEQUF3RCxDQUFDO0FBQzVGLFFBQUEsMEJBQTBCLEdBQUcsOERBQThELENBQUM7QUFpQmxHLEtBQUssVUFBVSxjQUFjLENBQUMsTUFBNEIsRUFBRSxLQUFpQyxFQUFFLFVBQXlDLEVBQUc7SUFDaEosaUZBQWlGO0lBQ2pGLGlGQUFpRjtJQUNqRiwyRUFBMkU7SUFDM0UsaUZBQWlGO0lBQ2pGLGdGQUFnRjtJQUNoRiw4RUFBOEU7SUFDOUUseUJBQXlCO0lBQ3pCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRSxNQUFNLElBQUksR0FBbUQ7UUFDM0QsTUFBTSxFQUFFLE1BQU07UUFDZCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNO1FBQ2hDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztRQUN0QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7UUFDMUIsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixJQUFJLGtDQUEwQjtRQUMxRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1FBQzFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNqQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7S0FDakIsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsTUFBTSxjQUFjLEdBQUcsR0FBRyxTQUFTLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLFFBQVEsTUFBTSxDQUFDO0lBQ2hHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDWCxJQUFBLFVBQUcsRUFBQyw0Q0FBNEMsRUFBRSxjQUFjLEVBQUUscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO1NBQU0sQ0FBQztRQUNOLElBQUEsVUFBRyxFQUFDLG1DQUFtQyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsTUFBTSxZQUFZLEdBQUc7UUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaLENBQUM7SUFDRixNQUFNLElBQUEsa0JBQVcsRUFBQyxZQUFZLEVBQUUsc0JBQVcsQ0FBQyxDQUFDO1FBQzNDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtRQUM1QixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7UUFDcEIsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUU7WUFDUCxjQUFjLEVBQUUsRUFBRTtZQUNsQixnQkFBZ0IsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUM7U0FDMUQ7S0FDRixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFFVSxRQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQyxDQUFDLGlCQUFpQjtBQUV2RCxTQUFnQixXQUFXLENBQUMsS0FBb0M7SUFDOUQsT0FBTyxLQUFLLEVBQUUsS0FBVSxFQUFFLEVBQUU7UUFDMUIsdUVBQXVFO1FBQ3ZFLHVFQUF1RTtRQUN2RSxhQUFhO1FBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssd0NBQWdDLEVBQUUsQ0FBQztZQUNwRyxJQUFBLFVBQUcsRUFBQyx1REFBdUQsQ0FBQyxDQUFDO1lBQzdELE1BQU0sY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFBQyxPQUFPLENBQU0sRUFBRSxDQUFDO1lBQ2hCLHFDQUFxQztZQUNyQyxJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztnQkFDdkIsSUFBQSxVQUFHLEVBQUMsNEJBQTRCLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLENBQUM7WUFDVixDQUFDO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUM5Qix5RUFBeUU7Z0JBQ3pFLG1FQUFtRTtnQkFDbkUsd0VBQXdFO2dCQUN4RSxxRUFBcUU7Z0JBQ3JFLGdDQUFnQztnQkFDaEMsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUNuQyxJQUFBLFVBQUcsRUFBQyw0R0FBNEcsQ0FBQyxDQUFDO29CQUNsSCxLQUFLLENBQUMsa0JBQWtCLEdBQUcsd0NBQWdDLENBQUM7Z0JBQzlELENBQUM7cUJBQU0sQ0FBQztvQkFDTixrRUFBa0U7b0JBQ2xFLDZEQUE2RDtvQkFDN0QsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7b0JBQ3hELElBQUEsVUFBRyxFQUFDLDZEQUE2RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzVKLENBQUM7WUFDSCxDQUFDO1lBRUQsbUVBQW1FO1lBQ25FLE1BQU0sY0FBYyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQ3BDLE1BQU0sRUFBRSwwQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQUMsT0FBd0I7SUFDNUQsMkNBQTJDO0lBQzNDLE1BQU0sZUFBZSxHQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUU3RSwrQ0FBK0M7SUFDL0MsTUFBTSxJQUFJLEdBQVksZUFBZSxDQUFDLElBQUksQ0FBQztJQUMzQyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3hDLE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDcEQseUVBQXlFO1FBQ3pFLGtGQUFrRjtRQUNsRixPQUFPLEVBQUUsR0FBRyxlQUFlLEVBQUUsSUFBSSxFQUFFLE9BQWMsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFDRCxPQUFPLEVBQUUsR0FBRyxlQUFlLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN4RyxDQUFDO0FBRUQsTUFBYSxLQUFNLFNBQVEsS0FBSztDQUFJO0FBQXBDLHNCQUFvQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgeyBodHRwUmVxdWVzdCB9IGZyb20gJy4vb3V0Ym91bmQnO1xuaW1wb3J0IHsgbG9nLCB3aXRoUmV0cmllcyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgdHlwZSB7IE9uRXZlbnRSZXNwb25zZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSID0gJ0FXU0NESzo6Q3VzdG9tUmVzb3VyY2VQcm92aWRlckZyYW1ld29yazo6Q1JFQVRFX0ZBSUxFRCc7XG5leHBvcnQgY29uc3QgTUlTU0lOR19QSFlTSUNBTF9JRF9NQVJLRVIgPSAnQVdTQ0RLOjpDdXN0b21SZXNvdXJjZVByb3ZpZGVyRnJhbWV3b3JrOjpNSVNTSU5HX1BIWVNJQ0FMX0lEJztcblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvblJlc3BvbnNlT3B0aW9ucyB7XG4gIHJlYWRvbmx5IHJlYXNvbj86IHN0cmluZztcbiAgcmVhZG9ubHkgbm9FY2hvPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvbkV2ZW50Q29udGV4dCB7XG4gIFN0YWNrSWQ6IHN0cmluZztcbiAgUmVxdWVzdElkOiBzdHJpbmc7XG4gIFBoeXNpY2FsUmVzb3VyY2VJZD86IHN0cmluZztcbiAgTG9naWNhbFJlc291cmNlSWQ6IHN0cmluZztcbiAgUmVzcG9uc2VVUkw6IHN0cmluZztcbiAgRGF0YT86IGFueTtcbiAgTm9FY2hvPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN1Ym1pdFJlc3BvbnNlKHN0YXR1czogJ1NVQ0NFU1MnIHwgJ0ZBSUxFRCcsIGV2ZW50OiBDbG91ZEZvcm1hdGlvbkV2ZW50Q29udGV4dCwgb3B0aW9uczogQ2xvdWRGb3JtYXRpb25SZXNwb25zZU9wdGlvbnMgPSB7IH0pIHtcbiAgLy8gTm9FY2hvIGlzIHNldCBpZiBlaXRoZXIgdGhlIGNhbGxlciBvciB0aGUgZXZlbnQgc2F5cyBzby4gQSBGQUlMRUQgcmVzcG9uc2UgZm9yXG4gIC8vIGFuIGlzQ29tcGxldGUgcmVxdWVzdCAoc3VibWl0dGVkIGJ5IHNhZmVIYW5kbGVyKSBkb2VzIG5vdCBwYXNzIHRoZSBvcHRpb24sIGJ1dFxuICAvLyB0aGUgcmVxdWVzdCBzdGlsbCBjYXJyaWVzIHRoZSBEYXRhIHJldHVybmVkIGJ5IG9uRXZlbnQuIFRoZSBjaGVjayBpcyBmb3JcbiAgLy8gdHJ1dGhpbmVzcywgbm90IGA9PT0gdHJ1ZWA6IGEgaGFuZGxlciB3cml0dGVuIGluIGFub3RoZXIgbGFuZ3VhZ2UsIG9yIG9uZSB0aGF0XG4gIC8vIGJ1aWxkcyBpdHMgSlNPTiBieSBoYW5kLCBjYW4gcmV0dXJuIGBcInRydWVcImAgb3IgYDFgLCB3aGljaCBDbG91ZEZvcm1hdGlvbiBhbmRcbiAgLy8gdGhlIGZyYW1ld29yayBoYXZlIGFsd2F5cyBob25vcmVkLiBUaGUgc2FtZSB2YWx1ZSBkZWNpZGVzIGJvdGggdGhlIHJlc3BvbnNlXG4gIC8vIGJvZHkgYW5kIHRoZSBsb2cgbGluZS5cbiAgY29uc3Qgbm9FY2hvID0gQm9vbGVhbihvcHRpb25zLm5vRWNobykgfHwgQm9vbGVhbihldmVudC5Ob0VjaG8pO1xuICBjb25zdCBqc29uOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVJlc3BvbnNlID0ge1xuICAgIFN0YXR1czogc3RhdHVzLFxuICAgIFJlYXNvbjogb3B0aW9ucy5yZWFzb24gfHwgc3RhdHVzLFxuICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgfHwgTUlTU0lOR19QSFlTSUNBTF9JRF9NQVJLRVIsXG4gICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgIE5vRWNobzogbm9FY2hvID8gdHJ1ZSA6IHVuZGVmaW5lZCxcbiAgICBEYXRhOiBldmVudC5EYXRhLFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KGpzb24pO1xuXG4gIGNvbnN0IHBhcnNlZFVybCA9IHVybC5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gIGNvbnN0IGxvZ2dpbmdTYWZlVXJsID0gYCR7cGFyc2VkVXJsLnByb3RvY29sfS8vJHtwYXJzZWRVcmwuaG9zdG5hbWV9LyR7cGFyc2VkVXJsLnBhdGhuYW1lfT8qKipgO1xuICBpZiAobm9FY2hvKSB7XG4gICAgbG9nKCdzdWJtaXQgcmVkYWN0ZWQgcmVzcG9uc2UgdG8gY2xvdWRmb3JtYXRpb24nLCBsb2dnaW5nU2FmZVVybCwgcmVkYWN0RGF0YUZyb21QYXlsb2FkKGpzb24pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2coJ3N1Ym1pdCByZXNwb25zZSB0byBjbG91ZGZvcm1hdGlvbicsIGxvZ2dpbmdTYWZlVXJsLCBqc29uKTtcbiAgfVxuXG4gIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHtcbiAgICBhdHRlbXB0czogNSxcbiAgICBzbGVlcDogMTAwMCxcbiAgfTtcbiAgYXdhaXQgd2l0aFJldHJpZXMocmV0cnlPcHRpb25zLCBodHRwUmVxdWVzdCkoe1xuICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnY29udGVudC10eXBlJzogJycsXG4gICAgICAnY29udGVudC1sZW5ndGgnOiBCdWZmZXIuYnl0ZUxlbmd0aChyZXNwb25zZUJvZHksICd1dGY4JyksXG4gICAgfSxcbiAgfSwgcmVzcG9uc2VCb2R5KTtcbn1cblxuZXhwb3J0IGxldCBpbmNsdWRlU3RhY2tUcmFjZXMgPSB0cnVlOyAvLyBmb3IgdW5pdCB0ZXN0c1xuXG5leHBvcnQgZnVuY3Rpb24gc2FmZUhhbmRsZXIoYmxvY2s6IChldmVudDogYW55KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiBhc3luYyAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIC8vIGlnbm9yZSBERUxFVEUgZXZlbnQgd2hlbiB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgaXMgdGhlIG1hcmtlciB0aGF0XG4gICAgLy8gaW5kaWNhdGVzIHRoYXQgdGhpcyBERUxFVEUgaXMgYSBzdWJzZXF1ZW50IERFTEVURSB0byBhIGZhaWxlZCBDUkVBVEVcbiAgICAvLyBvcGVyYXRpb24uXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgPT09IENSRUFURV9GQUlMRURfUEhZU0lDQUxfSURfTUFSS0VSKSB7XG4gICAgICBsb2coJ2lnbm9yaW5nIERFTEVURSBldmVudCBjYXVzZWQgYnkgYSBmYWlsZWQgQ1JFQVRFIGV2ZW50Jyk7XG4gICAgICBhd2FpdCBzdWJtaXRSZXNwb25zZSgnU1VDQ0VTUycsIGV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgYmxvY2soZXZlbnQpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgLy8gdGVsbCB3YWl0ZXIgc3RhdGUgbWFjaGluZSB0byByZXRyeVxuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBSZXRyeSkge1xuICAgICAgICBsb2coJ3JldHJ5IHJlcXVlc3RlZCBieSBoYW5kbGVyJyk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZTogaWYgQ1JFQVRFIGZhaWxzLCB3aGljaCB1c3VhbGx5IGltcGxpZXMsIHdlIHVzdWFsbHkgZG9uJ3RcbiAgICAgICAgLy8gaGF2ZSBhIHBoeXNpY2FsIHJlc291cmNlIGlkLiBpbiB0aGlzIGNhc2UsIHRoZSBzdWJzZXF1ZW50IERFTEVURVxuICAgICAgICAvLyBvcGVyYXRpb24gZG9lcyBub3QgaGF2ZSBhbnkgbWVhbmluZywgYW5kIHdpbGwgbGlrZWx5IGZhaWwgYXMgd2VsbC4gdG9cbiAgICAgICAgLy8gYWRkcmVzcyB0aGlzLCB3ZSB1c2UgYSBtYXJrZXIgc28gdGhlIHByb3ZpZGVyIGZyYW1ld29yayBjYW4gc2ltcGx5XG4gICAgICAgIC8vIGlnbm9yZSB0aGUgc3Vic2VxdWVudCBERUxFVEUuXG4gICAgICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScpIHtcbiAgICAgICAgICBsb2coJ0NSRUFURSBmYWlsZWQsIHJlc3BvbmRpbmcgd2l0aCBhIG1hcmtlciBwaHlzaWNhbCByZXNvdXJjZSBpZCBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IERFTEVURSB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgICAgICBldmVudC5QaHlzaWNhbFJlc291cmNlSWQgPSBDUkVBVEVfRkFJTEVEX1BIWVNJQ0FMX0lEX01BUktFUjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBvdGhlcndpc2UsIGlmIFBoeXNpY2FsUmVzb3VyY2VJZCBpcyBub3Qgc3BlY2lmaWVkLCBzb21ldGhpbmcgaXNcbiAgICAgICAgICAvLyB0ZXJyaWJseSB3cm9uZyBiZWNhdXNlIGFsbCBvdGhlciBldmVudHMgc2hvdWxkIGhhdmUgYW4gSUQuXG4gICAgICAgICAgY29uc3Qgc2FuaXRpemVkRXZlbnQgPSB7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfTtcbiAgICAgICAgICBsb2coYEVSUk9SOiBNYWxmb3JtZWQgZXZlbnQuIFwiUGh5c2ljYWxSZXNvdXJjZUlkXCIgaXMgcmVxdWlyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZXZlbnQuTm9FY2hvID8gcmVkYWN0RGF0YUZyb21QYXlsb2FkKHNhbml0aXplZEV2ZW50KSA6IHNhbml0aXplZEV2ZW50KX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB0aGlzIGlzIGFuIGFjdHVhbCBlcnJvciwgZmFpbCB0aGUgYWN0aXZpdHkgYWx0b2dldGhlciBhbmQgZXhpc3QuXG4gICAgICBhd2FpdCBzdWJtaXRSZXNwb25zZSgnRkFJTEVEJywgZXZlbnQsIHtcbiAgICAgICAgcmVhc29uOiBpbmNsdWRlU3RhY2tUcmFjZXMgPyBlLnN0YWNrIDogZS5tZXNzYWdlLFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBwYXlsb2FkIHdpdGggZXZlcnkgYERhdGFgIHZhbHVlIHJlcGxhY2VkLCBmb3IgbG9nZ2luZyBhXG4gKiBwYXlsb2FkIHRoYXQgaGFzIGBOb0VjaG9gIHNldC4gVGhlIGBEYXRhYCBrZXkgbmFtZXMgYXJlIGtlcHQ6IHRoZXkgYXJlIHRoZVxuICogYXR0cmlidXRlIG5hbWVzIHRoZSB0ZW1wbGF0ZSByZWFkcyB3aXRoIGBGbjo6R2V0QXR0YCwgc28gdGhleSBhcmUgbm90IHNlY3JldC5cbiAqXG4gKiBUaGUgc2FtZSBydWxlIGlzIGltcGxlbWVudGVkIGJ5IGByZWRhY3RSZXNwb25zZURhdGFgIGluXG4gKiBgQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlLWhhbmRsZXJzYCAoYG5vZGVqcy1lbnRyeXBvaW50LnRzYCBhbmRcbiAqIGBjb3JlL25vZGVqcy1lbnRyeXBvaW50LWhhbmRsZXIvaW5kZXgudHNgKSwgd2hpY2ggY2Fubm90IGltcG9ydCBpdC5cbiAqIGBjdXN0b20tcmVzb3VyY2VzL3Rlc3QvcHJvdmlkZXItZnJhbWV3b3JrL3JlZGFjdC1kYXRhLXBhcml0eS50ZXN0LnRzYCBydW5zIGFsbFxuICogdGhyZWUgb24gdGhlIHNhbWUgaW5wdXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVkYWN0RGF0YUZyb21QYXlsb2FkKHBheWxvYWQ6IE9uRXZlbnRSZXNwb25zZSk6IE9uRXZlbnRSZXNwb25zZSB7XG4gIC8vIENyZWF0ZSBhIGRlZXAgY29weSBvZiB0aGUgcGF5bG9hZCBvYmplY3RcbiAgY29uc3QgcmVkYWN0ZWRQYXlsb2FkOiBPbkV2ZW50UmVzcG9uc2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcblxuICAvLyBSZWRhY3QgdGhlIGRhdGEgaW4gdGhlIGNvcGllZCBwYXlsb2FkIG9iamVjdFxuICBjb25zdCBkYXRhOiB1bmtub3duID0gcmVkYWN0ZWRQYXlsb2FkLkRhdGE7XG4gIGlmIChkYXRhID09PSB1bmRlZmluZWQgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgIHJldHVybiByZWRhY3RlZFBheWxvYWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgLy8gbWFza2luZyBwZXIga2V5IG9ubHkgbWFrZXMgc2Vuc2UgZm9yIGFuIG9iamVjdDsgZm9yIGFueXRoaW5nIGVsc2UgKGZvclxuICAgIC8vIGV4YW1wbGUgYSBzdHJpbmcsIHdob3NlIGNoYXJhY3RlcnMgY2Fubm90IGJlIG92ZXJ3cml0dGVuKSBoaWRlIHRoZSB3aG9sZSB2YWx1ZS5cbiAgICByZXR1cm4geyAuLi5yZWRhY3RlZFBheWxvYWQsIERhdGE6ICcqKioqKicgYXMgYW55IH07XG4gIH1cbiAgcmV0dXJuIHsgLi4ucmVkYWN0ZWRQYXlsb2FkLCBEYXRhOiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmtleXMoZGF0YSkubWFwKGtleSA9PiBba2V5LCAnKioqKionXSkpIH07XG59XG5cbmV4cG9ydCBjbGFzcyBSZXRyeSBleHRlbmRzIEVycm9yIHsgfVxuIl19