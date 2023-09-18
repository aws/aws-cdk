"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.invoke = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const client_lambda_1 = require("@aws-sdk/client-lambda");
const node_http_handler_1 = require("@aws-sdk/node-http-handler");
const decodePayload = (payload) => {
    if (!payload) {
        return undefined;
    }
    return new TextDecoder().decode(Buffer.from(payload));
};
const invoke = async (functionName, invocationType, timeout) => {
    const lambda = new client_lambda_1.Lambda({
        requestHandler: new node_http_handler_1.NodeHttpHandler({
            socketTimeout: timeout,
        }),
    });
    const invokeRequest = { FunctionName: functionName, InvocationType: invocationType };
    console.log({ invokeRequest });
    // IAM policy changes can take some time to fully propagate
    // Therefore, retry for up to one minute
    let retryCount = 0;
    const delay = 5000;
    let rawResponse;
    while (true) {
        try {
            rawResponse = await lambda.invoke(invokeRequest);
            break;
        }
        catch (error) {
            if (error.name === 'AccessDeniedException' && retryCount < 12) {
                retryCount++;
                await new Promise((resolve) => {
                    setTimeout(resolve, delay);
                });
                continue;
            }
            throw error;
        }
    }
    const invokeResponse = {
        ...rawResponse,
        Payload: decodePayload(rawResponse.Payload),
    };
    console.log({ invokeResponse });
    return invokeResponse;
};
exports.invoke = invoke;
async function handler(event) {
    console.log({ ...event, ResponseURL: '...' });
    if (event.RequestType === 'Delete') {
        console.log('not calling trigger on DELETE');
        return;
    }
    if (event.RequestType === 'Update' && event.ResourceProperties.ExecuteOnHandlerChange === 'false') {
        console.log('not calling trigger because ExecuteOnHandlerChange is false');
        return;
    }
    const handlerArn = event.ResourceProperties.HandlerArn;
    if (!handlerArn) {
        throw new Error('The "HandlerArn" property is required');
    }
    const invocationType = event.ResourceProperties.InvocationType;
    const timeout = event.ResourceProperties.Timeout;
    const parsedTimeout = parseInt(timeout);
    if (isNaN(parsedTimeout)) {
        throw new Error(`The "Timeout" property with value ${timeout} is not parsable to a number`);
    }
    const invokeResponse = await (0, exports.invoke)(handlerArn, invocationType, parsedTimeout);
    if (invokeResponse.StatusCode && invokeResponse.StatusCode >= 400) {
        throw new Error(`Trigger handler failed with status code ${invokeResponse.StatusCode}`);
    }
    // if the lambda function throws an error, parse the error message and fail
    if (invokeResponse.FunctionError) {
        throw new Error(parseError(invokeResponse.Payload));
    }
}
exports.handler = handler;
/**
 * Parse the error message from the lambda function.
 */
function parseError(payload) {
    if (!payload) {
        return 'unknown handler error';
    }
    console.log(`Error payload: ${payload}`);
    try {
        const error = JSON.parse(payload);
        const concat = [error.errorMessage, error.trace].filter(x => x).join('\n');
        return concat.length > 0 ? concat : payload;
    }
    catch {
        // fall back to just returning the payload
        return payload;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0Isc0RBQXNEO0FBQ3RELDBEQUFvRTtBQUNwRSxrRUFBNkQ7QUFRN0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxPQUFvQixFQUFzQixFQUFFO0lBQ2pFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUVLLE1BQU0sTUFBTSxHQUFtQixLQUFLLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNwRixNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUM7UUFDeEIsY0FBYyxFQUFFLElBQUksbUNBQWUsQ0FBQztZQUNsQyxhQUFhLEVBQUUsT0FBTztTQUN2QixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsQ0FBQztJQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUUvQiwyREFBMkQ7SUFDM0Qsd0NBQXdDO0lBRXhDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7SUFFbkIsSUFBSSxXQUFXLENBQUM7SUFDaEIsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFJO1lBQ0YsV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRCxNQUFNO1NBQ1A7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtB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QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUM3QztJQUFDLE1BQU07UUFDTiwwQ0FBMEM7UUFDMUMsT0FBTyxPQUFPLENBQUM7S0FDaEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IExhbWJkYSwgSW52b2NhdGlvblJlc3BvbnNlIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG5pbXBvcnQgeyBOb2RlSHR0cEhhbmRsZXIgfSBmcm9tICdAYXdzLXNkay9ub2RlLWh0dHAtaGFuZGxlcic7XG5cbmV4cG9ydCB0eXBlIERlY29kZWRJbnZvY2F0aW9uUmVzcG9uc2UgPSBPbWl0PEludm9jYXRpb25SZXNwb25zZSwgJ1BheWxvYWQnPiAmIHtcbiAgUGF5bG9hZD86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbiA9IChmdW5jdGlvbk5hbWU6IHN0cmluZywgaW52b2NhdGlvblR5cGU6IHN0cmluZywgdGltZW91dDogbnVtYmVyKSA9PiBQcm9taXNlPERlY29kZWRJbnZvY2F0aW9uUmVzcG9uc2U+O1xuXG5jb25zdCBkZWNvZGVQYXlsb2FkID0gKHBheWxvYWQ/OiBVaW50OEFycmF5KTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFwYXlsb2FkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoQnVmZmVyLmZyb20ocGF5bG9hZCkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGludm9rZTogSW52b2tlRnVuY3Rpb24gPSBhc3luYyAoZnVuY3Rpb25OYW1lLCBpbnZvY2F0aW9uVHlwZSwgdGltZW91dCkgPT4ge1xuICBjb25zdCBsYW1iZGEgPSBuZXcgTGFtYmRhKHtcbiAgICByZXF1ZXN0SGFuZGxlcjogbmV3IE5vZGVIdHRwSGFuZGxlcih7XG4gICAgICBzb2NrZXRUaW1lb3V0OiB0aW1lb3V0LFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBpbnZva2VSZXF1ZXN0ID0geyBGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSwgSW52b2NhdGlvblR5cGU6IGludm9jYXRpb25UeXBlIH07XG4gIGNvbnNvbGUubG9nKHsgaW52b2tlUmVxdWVzdCB9KTtcblxuICAvLyBJQU0gcG9saWN5IGNoYW5nZXMgY2FuIHRha2Ugc29tZSB0aW1lIHRvIGZ1bGx5IHByb3BhZ2F0ZVxuICAvLyBUaGVyZWZvcmUsIHJldHJ5IGZvciB1cCB0byBvbmUgbWludXRlXG5cbiAgbGV0IHJldHJ5Q291bnQgPSAwO1xuICBjb25zdCBkZWxheSA9IDUwMDA7XG5cbiAgbGV0IHJhd1Jlc3BvbnNlO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICByYXdSZXNwb25zZSA9IGF3YWl0IGxhbWJkYS5pbnZva2UoaW52b2tlUmVxdWVzdCk7XG4gICAgICBicmVhaztcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0FjY2Vzc0RlbmllZEV4Y2VwdGlvbicgJiYgcmV0cnlDb3VudCA8IDEyKSB7XG4gICAgICAgIHJldHJ5Q291bnQrKztcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbnZva2VSZXNwb25zZSA9IHtcbiAgICAuLi5yYXdSZXNwb25zZSxcbiAgICBQYXlsb2FkOiBkZWNvZGVQYXlsb2FkKHJhd1Jlc3BvbnNlLlBheWxvYWQpLFxuICB9O1xuXG4gIGNvbnNvbGUubG9nKHsgaW52b2tlUmVzcG9uc2UgfSk7XG4gIHJldHVybiBpbnZva2VSZXNwb25zZTtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KTtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7XG4gICAgY29uc29sZS5sb2coJ25vdCBjYWxsaW5nIHRyaWdnZXIgb24gREVMRVRFJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJyAmJiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRXhlY3V0ZU9uSGFuZGxlckNoYW5nZSA9PT0gJ2ZhbHNlJykge1xuICAgIGNvbnNvbGUubG9nKCdub3QgY2FsbGluZyB0cmlnZ2VyIGJlY2F1c2UgRXhlY3V0ZU9uSGFuZGxlckNoYW5nZSBpcyBmYWxzZScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZXJBcm4gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuSGFuZGxlckFybjtcbiAgaWYgKCFoYW5kbGVyQXJuKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJIYW5kbGVyQXJuXCIgcHJvcGVydHkgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGNvbnN0IGludm9jYXRpb25UeXBlID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkludm9jYXRpb25UeXBlO1xuICBjb25zdCB0aW1lb3V0ID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRpbWVvdXQ7XG5cbiAgY29uc3QgcGFyc2VkVGltZW91dCA9IHBhcnNlSW50KHRpbWVvdXQpO1xuICBpZiAoaXNOYU4ocGFyc2VkVGltZW91dCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcIlRpbWVvdXRcIiBwcm9wZXJ0eSB3aXRoIHZhbHVlICR7dGltZW91dH0gaXMgbm90IHBhcnNhYmxlIHRvIGEgbnVtYmVyYCk7XG4gIH1cblxuICBjb25zdCBpbnZva2VSZXNwb25zZSA9IGF3YWl0IGludm9rZShoYW5kbGVyQXJuLCBpbnZvY2F0aW9uVHlwZSwgcGFyc2VkVGltZW91dCk7XG5cbiAgaWYgKGludm9rZVJlc3BvbnNlLlN0YXR1c0NvZGUgJiYgaW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRyaWdnZXIgaGFuZGxlciBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAke2ludm9rZVJlc3BvbnNlLlN0YXR1c0NvZGV9YCk7XG4gIH1cblxuICAvLyBpZiB0aGUgbGFtYmRhIGZ1bmN0aW9uIHRocm93cyBhbiBlcnJvciwgcGFyc2UgdGhlIGVycm9yIG1lc3NhZ2UgYW5kIGZhaWxcbiAgaWYgKGludm9rZVJlc3BvbnNlLkZ1bmN0aW9uRXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocGFyc2VFcnJvcihpbnZva2VSZXNwb25zZS5QYXlsb2FkKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZXJyb3IgbWVzc2FnZSBmcm9tIHRoZSBsYW1iZGEgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRXJyb3IocGF5bG9hZD86IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmICghcGF5bG9hZCkge1xuICAgIHJldHVybiAndW5rbm93biBoYW5kbGVyIGVycm9yJztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGBFcnJvciBwYXlsb2FkOiAke3BheWxvYWR9YCk7XG5cbiAgdHJ5IHtcblxuICAgIGNvbnN0IGVycm9yID0gSlNPTi5wYXJzZShwYXlsb2FkKTtcbiAgICBjb25zdCBjb25jYXQgPSBbZXJyb3IuZXJyb3JNZXNzYWdlLCBlcnJvci50cmFjZV0uZmlsdGVyKHggPT4geCkuam9pbignXFxuJyk7XG4gICAgcmV0dXJuIGNvbmNhdC5sZW5ndGggPiAwID8gY29uY2F0IDogcGF5bG9hZDtcbiAgfSBjYXRjaCB7XG4gICAgLy8gZmFsbCBiYWNrIHRvIGp1c3QgcmV0dXJuaW5nIHRoZSBwYXlsb2FkXG4gICAgcmV0dXJuIHBheWxvYWQ7XG4gIH1cbn1cbiJdfQ==