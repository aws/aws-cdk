"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.invoke = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const client_lambda_1 = require("@aws-sdk/client-lambda");
const node_http_handler_1 = require("@aws-sdk/node-http-handler");
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
    let invokeResponse;
    while (true) {
        try {
            invokeResponse = await lambda.invoke(invokeRequest);
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
        throw new Error(`The "Timeout" property with value ${timeout} is not parseable to a number`);
    }
    const invokeResponse = await (0, exports.invoke)(handlerArn, invocationType, parsedTimeout);
    if (invokeResponse.StatusCode && invokeResponse.StatusCode >= 400) {
        throw new Error(`Trigger handler failed with status code ${invokeResponse.StatusCode}`);
    }
    // if the lambda function throws an error, parse the error message and fail
    if (invokeResponse.FunctionError) {
        throw new Error(parseError(invokeResponse.Payload?.toString()));
    }
}
exports.handler = handler;
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
    catch {
        // fall back to just returning the payload
        return payload;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0Isc0RBQXNEO0FBQ3RELDBEQUFvRTtBQUNwRSxrRUFBNkQ7QUFJdEQsTUFBTSxNQUFNLEdBQW1CLEtBQUssRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ3BGLE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQU0sQ0FBQztRQUN4QixjQUFjLEVBQUUsSUFBSSxtQ0FBZSxDQUFDO1lBQ2xDLGFBQWEsRUFBRSxPQUFPO1NBQ3ZCLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxNQUFNLGFBQWEsR0FBRyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxDQUFDO0lBQ3JGLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRS9CLDJEQUEyRDtJQUMzRCx3Q0FBd0M7SUFFeEMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGNBQWMsQ0FBQztJQUNuQixPQUFPLElBQUksRUFBRTtRQUNYLElBQUk7WUFDRixjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELE1BQU07U0FDUDtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyx1QkFBdUIsSUFBSSxVQUFVLEdBQUcsRUFBRSxFQUFFO2dCQUM3RCxVQUFVLEVBQUUsQ0FBQztnQkFDYixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQzVCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDO2dCQUNILFNBQVM7YUFDVjtZQUVELE1BQU0sS0FBSyxDQUFDO1NBQ2I7S0FDRjtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQXBDVyxRQUFBLE1BQU0sVUFvQ2pCO0FBRUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFOUMsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0MsT0FBTztLQUNSO0lBRUQsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLEtBQUssT0FBTyxFQUFFO1FBQ2pHLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUMzRSxPQUFPO0tBQ1I7SUFFRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO0lBQ3ZELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDMUQ7SUFFRCxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDO0lBQy9ELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7SUFFakQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLE9BQU8sK0JBQStCLENBQUMsQ0FBQztLQUM5RjtJQUVELE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBQSxjQUFNLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUUvRSxJQUFJLGNBQWMsQ0FBQyxVQUFVLElBQUksY0FBYyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7UUFDakUsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDekY7SUFFRCwyRUFBMkU7SUFDM0UsSUFBSSxjQUFjLENBQUMsYUFBYSxFQUFFO1FBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pFO0FBQ0gsQ0FBQztBQXBDRCwwQkFvQ0M7QUFFRDs7R0FFRztBQUNILFNBQVMsVUFBVSxDQUFDLE9BQTJCO0lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sdUJBQXVCLENBQUM7S0FDaEM7SUFDRCxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUM3QztJQUFDLE1BQU07UUFDTiwwQ0FBMEM7UUFDMUMsT0FBTyxPQUFPLENBQUM7S0FDaEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IExhbWJkYSwgSW52b2NhdGlvblJlc3BvbnNlIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG5pbXBvcnQgeyBOb2RlSHR0cEhhbmRsZXIgfSBmcm9tICdAYXdzLXNkay9ub2RlLWh0dHAtaGFuZGxlcic7XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uID0gKGZ1bmN0aW9uTmFtZTogc3RyaW5nLCBpbnZvY2F0aW9uVHlwZTogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIpID0+IFByb21pc2U8SW52b2NhdGlvblJlc3BvbnNlPjtcblxuZXhwb3J0IGNvbnN0IGludm9rZTogSW52b2tlRnVuY3Rpb24gPSBhc3luYyAoZnVuY3Rpb25OYW1lLCBpbnZvY2F0aW9uVHlwZSwgdGltZW91dCkgPT4ge1xuICBjb25zdCBsYW1iZGEgPSBuZXcgTGFtYmRhKHtcbiAgICByZXF1ZXN0SGFuZGxlcjogbmV3IE5vZGVIdHRwSGFuZGxlcih7XG4gICAgICBzb2NrZXRUaW1lb3V0OiB0aW1lb3V0LFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBpbnZva2VSZXF1ZXN0ID0geyBGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSwgSW52b2NhdGlvblR5cGU6IGludm9jYXRpb25UeXBlIH07XG4gIGNvbnNvbGUubG9nKHsgaW52b2tlUmVxdWVzdCB9KTtcblxuICAvLyBJQU0gcG9saWN5IGNoYW5nZXMgY2FuIHRha2Ugc29tZSB0aW1lIHRvIGZ1bGx5IHByb3BhZ2F0ZVxuICAvLyBUaGVyZWZvcmUsIHJldHJ5IGZvciB1cCB0byBvbmUgbWludXRlXG5cbiAgbGV0IHJldHJ5Q291bnQgPSAwO1xuICBjb25zdCBkZWxheSA9IDUwMDA7XG5cbiAgbGV0IGludm9rZVJlc3BvbnNlO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICBpbnZva2VSZXNwb25zZSA9IGF3YWl0IGxhbWJkYS5pbnZva2UoaW52b2tlUmVxdWVzdCk7XG4gICAgICBicmVhaztcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0FjY2Vzc0RlbmllZEV4Y2VwdGlvbicgJiYgcmV0cnlDb3VudCA8IDEyKSB7XG4gICAgICAgIHJldHJ5Q291bnQrKztcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmxvZyh7IGludm9rZVJlc3BvbnNlIH0pO1xuICByZXR1cm4gaW52b2tlUmVzcG9uc2U7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zb2xlLmxvZyh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSk7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGNvbnNvbGUubG9nKCdub3QgY2FsbGluZyB0cmlnZ2VyIG9uIERFTEVURScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgPT09ICdmYWxzZScpIHtcbiAgICBjb25zb2xlLmxvZygnbm90IGNhbGxpbmcgdHJpZ2dlciBiZWNhdXNlIEV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgaXMgZmFsc2UnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBoYW5kbGVyQXJuID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhhbmRsZXJBcm47XG4gIGlmICghaGFuZGxlckFybikge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiSGFuZGxlckFyblwiIHByb3BlcnR5IGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCBpbnZvY2F0aW9uVHlwZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnZvY2F0aW9uVHlwZTtcbiAgY29uc3QgdGltZW91dCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UaW1lb3V0O1xuXG4gIGNvbnN0IHBhcnNlZFRpbWVvdXQgPSBwYXJzZUludCh0aW1lb3V0KTtcbiAgaWYgKGlzTmFOKHBhcnNlZFRpbWVvdXQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJUaW1lb3V0XCIgcHJvcGVydHkgd2l0aCB2YWx1ZSAke3RpbWVvdXR9IGlzIG5vdCBwYXJzZWFibGUgdG8gYSBudW1iZXJgKTtcbiAgfVxuXG4gIGNvbnN0IGludm9rZVJlc3BvbnNlID0gYXdhaXQgaW52b2tlKGhhbmRsZXJBcm4sIGludm9jYXRpb25UeXBlLCBwYXJzZWRUaW1lb3V0KTtcblxuICBpZiAoaW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZSAmJiBpbnZva2VSZXNwb25zZS5TdGF0dXNDb2RlID49IDQwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVHJpZ2dlciBoYW5kbGVyIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7aW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZX1gKTtcbiAgfVxuXG4gIC8vIGlmIHRoZSBsYW1iZGEgZnVuY3Rpb24gdGhyb3dzIGFuIGVycm9yLCBwYXJzZSB0aGUgZXJyb3IgbWVzc2FnZSBhbmQgZmFpbFxuICBpZiAoaW52b2tlUmVzcG9uc2UuRnVuY3Rpb25FcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihwYXJzZUVycm9yKGludm9rZVJlc3BvbnNlLlBheWxvYWQ/LnRvU3RyaW5nKCkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBlcnJvciBtZXNzYWdlIGZyb20gdGhlIGxhbWJkYSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFcnJvcihwYXlsb2FkOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zb2xlLmxvZyhgRXJyb3IgcGF5bG9hZDogJHtwYXlsb2FkfWApO1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gJ3Vua25vd24gaGFuZGxlciBlcnJvcic7XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBlcnJvciA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgY29uc3QgY29uY2F0ID0gW2Vycm9yLmVycm9yTWVzc2FnZSwgZXJyb3IudHJhY2VdLmZpbHRlcih4ID0+IHgpLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBjb25jYXQubGVuZ3RoID4gMCA/IGNvbmNhdCA6IHBheWxvYWQ7XG4gIH0gY2F0Y2gge1xuICAgIC8vIGZhbGwgYmFjayB0byBqdXN0IHJldHVybmluZyB0aGUgcGF5bG9hZFxuICAgIHJldHVybiBwYXlsb2FkO1xuICB9XG59XG4iXX0=