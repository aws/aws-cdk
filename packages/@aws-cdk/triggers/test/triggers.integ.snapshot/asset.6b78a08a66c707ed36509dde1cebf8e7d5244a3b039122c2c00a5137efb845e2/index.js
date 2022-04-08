"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.invoke = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require("aws-sdk");
exports.invoke = async (functionName) => {
    const lambda = new AWS.Lambda();
    const invokeRequest = { FunctionName: functionName };
    console.log({ invokeRequest });
    const invokeResponse = await lambda.invoke(invokeRequest).promise();
    console.log({ invokeResponse });
    return invokeResponse;
};
async function handler(event) {
    var _a;
    console.log({ event });
    if (event.RequestType === 'Delete') {
        console.log('not calling trigger on DELETE');
        return;
    }
    const handlerArn = event.ResourceProperties.HandlerArn;
    if (!handlerArn) {
        throw new Error('The "HandlerArn" property is required');
    }
    const invokeResponse = await exports.invoke(handlerArn);
    if (invokeResponse.StatusCode !== 200) {
        throw new Error(`Trigger handler failed with status code ${invokeResponse.StatusCode}`);
    }
    // if the lambda function throws an error, parse the error message and fail
    if (invokeResponse.FunctionError) {
        throw new Error(parseError((_a = invokeResponse.Payload) === null || _a === void 0 ? void 0 : _a.toString()));
    }
}
exports.handler = handler;
;
/**
 * Parse the error message from the lambda function.
 */
function parseError(payload) {
    console.log(`Error payload: ${payload}`);
    if (!payload) {
        return 'unknown handler error';
    }
    try {
        const error = JSON.parse(payload);
        const concat = [error.errorMessage, error.trace].filter(x => x).join('\n');
        return concat.length > 0 ? concat : payload;
    }
    catch (e) {
        // fall back to just returning the payload
        return payload;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQUlsQixRQUFBLE1BQU0sR0FBbUIsS0FBSyxFQUFDLFlBQVksRUFBQyxFQUFFO0lBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hDLE1BQU0sYUFBYSxHQUFHLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLE1BQU0sY0FBYyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUNoQyxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFSyxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEOztJQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUV2QixJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3QyxPQUFPO0tBQ1I7SUFFRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO0lBQ3ZELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDMUQ7SUFFRCxNQUFNLGNBQWMsR0FBRyxNQUFNLGNBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVoRCxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFFO1FBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ3pGO0lBRUQsMkVBQTJFO0lBQzNFLElBQUksY0FBYyxDQUFDLGFBQWEsRUFBRTtRQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsT0FBQyxjQUFjLENBQUMsT0FBTywwQ0FBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0tBQ2pFO0FBQ0gsQ0FBQztBQXZCRCwwQkF1QkM7QUFBQSxDQUFDO0FBRUY7O0dBRUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxPQUEyQjtJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFBRSxPQUFPLHVCQUF1QixDQUFDO0tBQUU7SUFDakQsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0UsT0FBTyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7S0FDN0M7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLDBDQUEwQztRQUMxQyxPQUFPLE9BQU8sQ0FBQztLQUNoQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcblxuZXhwb3J0IHR5cGUgSW52b2tlRnVuY3Rpb24gPSAoZnVuY3Rpb25OYW1lOiBzdHJpbmcpID0+IFByb21pc2U8QVdTLkxhbWJkYS5JbnZvY2F0aW9uUmVzcG9uc2U+O1xuXG5leHBvcnQgY29uc3QgaW52b2tlOiBJbnZva2VGdW5jdGlvbiA9IGFzeW5jIGZ1bmN0aW9uTmFtZSA9PiB7XG4gIGNvbnN0IGxhbWJkYSA9IG5ldyBBV1MuTGFtYmRhKCk7XG4gIGNvbnN0IGludm9rZVJlcXVlc3QgPSB7IEZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lIH07XG4gIGNvbnNvbGUubG9nKHsgaW52b2tlUmVxdWVzdCB9KTtcbiAgY29uc3QgaW52b2tlUmVzcG9uc2UgPSBhd2FpdCBsYW1iZGEuaW52b2tlKGludm9rZVJlcXVlc3QpLnByb21pc2UoKTtcbiAgY29uc29sZS5sb2coeyBpbnZva2VSZXNwb25zZSB9KTtcbiAgcmV0dXJuIGludm9rZVJlc3BvbnNlO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc29sZS5sb2coeyBldmVudCB9KTtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7XG4gICAgY29uc29sZS5sb2coJ25vdCBjYWxsaW5nIHRyaWdnZXIgb24gREVMRVRFJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaGFuZGxlckFybiA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5IYW5kbGVyQXJuO1xuICBpZiAoIWhhbmRsZXJBcm4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcIkhhbmRsZXJBcm5cIiBwcm9wZXJ0eSBpcyByZXF1aXJlZCcpO1xuICB9XG5cbiAgY29uc3QgaW52b2tlUmVzcG9uc2UgPSBhd2FpdCBpbnZva2UoaGFuZGxlckFybik7XG5cbiAgaWYgKGludm9rZVJlc3BvbnNlLlN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVHJpZ2dlciBoYW5kbGVyIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7aW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZX1gKTtcbiAgfVxuXG4gIC8vIGlmIHRoZSBsYW1iZGEgZnVuY3Rpb24gdGhyb3dzIGFuIGVycm9yLCBwYXJzZSB0aGUgZXJyb3IgbWVzc2FnZSBhbmQgZmFpbFxuICBpZiAoaW52b2tlUmVzcG9uc2UuRnVuY3Rpb25FcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihwYXJzZUVycm9yKGludm9rZVJlc3BvbnNlLlBheWxvYWQ/LnRvU3RyaW5nKCkpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZXJyb3IgbWVzc2FnZSBmcm9tIHRoZSBsYW1iZGEgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRXJyb3IocGF5bG9hZDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc29sZS5sb2coYEVycm9yIHBheWxvYWQ6ICR7cGF5bG9hZH1gKTtcbiAgaWYgKCFwYXlsb2FkKSB7IHJldHVybiAndW5rbm93biBoYW5kbGVyIGVycm9yJzsgfVxuICB0cnkge1xuICAgIGNvbnN0IGVycm9yID0gSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICBjb25zdCBjb25jYXQgPSBbZXJyb3IuZXJyb3JNZXNzYWdlLCBlcnJvci50cmFjZV0uZmlsdGVyKHggPT4geCkuam9pbignXFxuJyk7XG4gICAgcmV0dXJuIGNvbmNhdC5sZW5ndGggPiAwID8gY29uY2F0IDogcGF5bG9hZDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGZhbGwgYmFjayB0byBqdXN0IHJldHVybmluZyB0aGUgcGF5bG9hZFxuICAgIHJldHVybiBwYXlsb2FkO1xuICB9XG59XG4iXX0=