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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0Isc0RBQXNEO0FBQ3RELDBEQUFvRTtBQUNwRSxrRUFBNkQ7QUFRN0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxPQUFvQixFQUFzQixFQUFFO0lBQ2pFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUVLLE1BQU0sTUFBTSxHQUFtQixLQUFLLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNwRixNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUM7UUFDeEIsY0FBYyxFQUFFLElBQUksbUNBQWUsQ0FBQztZQUNsQyxhQUFhLEVBQUUsT0FBTztTQUN2QixDQUFRO0tBQ1YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsQ0FBQztJQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUUvQiwyREFBMkQ7SUFDM0Qsd0NBQXdDO0lBRXhDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7SUFFbkIsSUFBSSxXQUFXLENBQUM7SUFDaEIsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFJO1lBQ0YsV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRCxNQUFNO1NBQ1A7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtB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QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUM3QztJQUFDLE1BQU07UUFDTiwwQ0FBMEM7UUFDMUMsT0FBTyxPQUFPLENBQUM7S0FDaEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IExhbWJkYSwgSW52b2NhdGlvblJlc3BvbnNlIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG5pbXBvcnQgeyBOb2RlSHR0cEhhbmRsZXIgfSBmcm9tICdAYXdzLXNkay9ub2RlLWh0dHAtaGFuZGxlcic7XG5cbmV4cG9ydCB0eXBlIERlY29kZWRJbnZvY2F0aW9uUmVzcG9uc2UgPSBPbWl0PEludm9jYXRpb25SZXNwb25zZSwgJ1BheWxvYWQnPiAmIHtcbiAgUGF5bG9hZD86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbiA9IChmdW5jdGlvbk5hbWU6IHN0cmluZywgaW52b2NhdGlvblR5cGU6IHN0cmluZywgdGltZW91dDogbnVtYmVyKSA9PiBQcm9taXNlPERlY29kZWRJbnZvY2F0aW9uUmVzcG9uc2U+O1xuXG5jb25zdCBkZWNvZGVQYXlsb2FkID0gKHBheWxvYWQ/OiBVaW50OEFycmF5KTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFwYXlsb2FkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoQnVmZmVyLmZyb20ocGF5bG9hZCkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGludm9rZTogSW52b2tlRnVuY3Rpb24gPSBhc3luYyAoZnVuY3Rpb25OYW1lLCBpbnZvY2F0aW9uVHlwZSwgdGltZW91dCkgPT4ge1xuICBjb25zdCBsYW1iZGEgPSBuZXcgTGFtYmRhKHtcbiAgICByZXF1ZXN0SGFuZGxlcjogbmV3IE5vZGVIdHRwSGFuZGxlcih7XG4gICAgICBzb2NrZXRUaW1lb3V0OiB0aW1lb3V0LFxuICAgIH0pIGFzIGFueSxcbiAgfSk7XG5cbiAgY29uc3QgaW52b2tlUmVxdWVzdCA9IHsgRnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsIEludm9jYXRpb25UeXBlOiBpbnZvY2F0aW9uVHlwZSB9O1xuICBjb25zb2xlLmxvZyh7IGludm9rZVJlcXVlc3QgfSk7XG5cbiAgLy8gSUFNIHBvbGljeSBjaGFuZ2VzIGNhbiB0YWtlIHNvbWUgdGltZSB0byBmdWxseSBwcm9wYWdhdGVcbiAgLy8gVGhlcmVmb3JlLCByZXRyeSBmb3IgdXAgdG8gb25lIG1pbnV0ZVxuXG4gIGxldCByZXRyeUNvdW50ID0gMDtcbiAgY29uc3QgZGVsYXkgPSA1MDAwO1xuXG4gIGxldCByYXdSZXNwb25zZTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgcmF3UmVzcG9uc2UgPSBhd2FpdCBsYW1iZGEuaW52b2tlKGludm9rZVJlcXVlc3QpO1xuICAgICAgYnJlYWs7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLm5hbWUgPT09ICdBY2Nlc3NEZW5pZWRFeGNlcHRpb24nICYmIHJldHJ5Q291bnQgPCAxMikge1xuICAgICAgICByZXRyeUNvdW50Kys7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW52b2tlUmVzcG9uc2UgPSB7XG4gICAgLi4ucmF3UmVzcG9uc2UsXG4gICAgUGF5bG9hZDogZGVjb2RlUGF5bG9hZChyYXdSZXNwb25zZS5QYXlsb2FkKSxcbiAgfTtcblxuICBjb25zb2xlLmxvZyh7IGludm9rZVJlc3BvbnNlIH0pO1xuICByZXR1cm4gaW52b2tlUmVzcG9uc2U7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zb2xlLmxvZyh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSk7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGNvbnNvbGUubG9nKCdub3QgY2FsbGluZyB0cmlnZ2VyIG9uIERFTEVURScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgPT09ICdmYWxzZScpIHtcbiAgICBjb25zb2xlLmxvZygnbm90IGNhbGxpbmcgdHJpZ2dlciBiZWNhdXNlIEV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgaXMgZmFsc2UnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBoYW5kbGVyQXJuID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhhbmRsZXJBcm47XG4gIGlmICghaGFuZGxlckFybikge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiSGFuZGxlckFyblwiIHByb3BlcnR5IGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCBpbnZvY2F0aW9uVHlwZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnZvY2F0aW9uVHlwZTtcbiAgY29uc3QgdGltZW91dCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UaW1lb3V0O1xuXG4gIGNvbnN0IHBhcnNlZFRpbWVvdXQgPSBwYXJzZUludCh0aW1lb3V0KTtcbiAgaWYgKGlzTmFOKHBhcnNlZFRpbWVvdXQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJUaW1lb3V0XCIgcHJvcGVydHkgd2l0aCB2YWx1ZSAke3RpbWVvdXR9IGlzIG5vdCBwYXJzYWJsZSB0byBhIG51bWJlcmApO1xuICB9XG5cbiAgY29uc3QgaW52b2tlUmVzcG9uc2UgPSBhd2FpdCBpbnZva2UoaGFuZGxlckFybiwgaW52b2NhdGlvblR5cGUsIHBhcnNlZFRpbWVvdXQpO1xuXG4gIGlmIChpbnZva2VSZXNwb25zZS5TdGF0dXNDb2RlICYmIGludm9rZVJlc3BvbnNlLlN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUcmlnZ2VyIGhhbmRsZXIgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtpbnZva2VSZXNwb25zZS5TdGF0dXNDb2RlfWApO1xuICB9XG5cbiAgLy8gaWYgdGhlIGxhbWJkYSBmdW5jdGlvbiB0aHJvd3MgYW4gZXJyb3IsIHBhcnNlIHRoZSBlcnJvciBtZXNzYWdlIGFuZCBmYWlsXG4gIGlmIChpbnZva2VSZXNwb25zZS5GdW5jdGlvbkVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHBhcnNlRXJyb3IoaW52b2tlUmVzcG9uc2UuUGF5bG9hZCkpO1xuICB9XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGVycm9yIG1lc3NhZ2UgZnJvbSB0aGUgbGFtYmRhIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBwYXJzZUVycm9yKHBheWxvYWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gJ3Vua25vd24gaGFuZGxlciBlcnJvcic7XG4gIH1cblxuICBjb25zb2xlLmxvZyhgRXJyb3IgcGF5bG9hZDogJHtwYXlsb2FkfWApO1xuXG4gIHRyeSB7XG5cbiAgICBjb25zdCBlcnJvciA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgY29uc3QgY29uY2F0ID0gW2Vycm9yLmVycm9yTWVzc2FnZSwgZXJyb3IudHJhY2VdLmZpbHRlcih4ID0+IHgpLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBjb25jYXQubGVuZ3RoID4gMCA/IGNvbmNhdCA6IHBheWxvYWQ7XG4gIH0gY2F0Y2gge1xuICAgIC8vIGZhbGwgYmFjayB0byBqdXN0IHJldHVybmluZyB0aGUgcGF5bG9hZFxuICAgIHJldHVybiBwYXlsb2FkO1xuICB9XG59XG4iXX0=