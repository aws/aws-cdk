"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.invoke = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const client_account_1 = require("@aws-sdk/client-account");
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
            if (error instanceof client_account_1.AccessDeniedException && retryCount < 12) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0Isc0RBQXNEO0FBQ3RELDREQUFnRTtBQUNoRSwwREFBb0U7QUFDcEUsa0VBQTZEO0FBSXRELE1BQU0sTUFBTSxHQUFtQixLQUFLLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNwRixNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUM7UUFDeEIsY0FBYyxFQUFFLElBQUksbUNBQWUsQ0FBQztZQUNsQyxhQUFhLEVBQUUsT0FBTztTQUN2QixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsQ0FBQztJQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUUvQiwyREFBMkQ7SUFDM0Qsd0NBQXdDO0lBRXhDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7SUFFbkIsSUFBSSxjQUFjLENBQUM7SUFDbkIsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFJO1lBQ0YsY0FBYyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwRCxNQUFNO1NBQ1A7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksS0FBSyxZQUFZLHNDQUFxQixJQUFJLFVBQVUsR0FBRyxFQUFFLEVBQUU7Z0JBQzdELFVBQVUsRUFBRSxDQUFDO2dCQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDNUIsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsU0FBUzthQUNWO1lBRUQsTUFBTSxLQUFLLENBQUM7U0FDYjtLQUNGO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDaEMsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBcENXLFFBQUEsTUFBTSxVQW9DakI7QUFFSyxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUU5QyxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3QyxPQUFPO0tBQ1I7SUFFRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsS0FBSyxPQUFPLEVBQUU7UUFDakcsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1FBQzNFLE9BQU87S0FDUjtJQUVELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7SUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztLQUMxRDtJQUVELE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7SUFDL0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztJQUVqRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsT0FBTywrQkFBK0IsQ0FBQyxDQUFDO0tBQzlGO0lBRUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFBLGNBQU0sRUFBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBRS9FLElBQUksY0FBYyxDQUFDLFVBQVUsSUFBSSxjQUFjLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRTtRQUNqRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUN6RjtJQUVELDJFQUEyRTtJQUMzRSxJQUFJLGNBQWMsQ0FBQyxhQUFhLEVBQUU7UUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDO0FBcENELDBCQW9DQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxVQUFVLENBQUMsT0FBMkI7SUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyx1QkFBdUIsQ0FBQztLQUNoQztJQUNELElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNFLE9BQU8sTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0tBQzdDO0lBQUMsTUFBTTtRQUNOLDBDQUEwQztRQUMxQyxPQUFPLE9BQU8sQ0FBQztLQUNoQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgQWNjZXNzRGVuaWVkRXhjZXB0aW9uIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWFjY291bnQnO1xuaW1wb3J0IHsgTGFtYmRhLCBJbnZvY2F0aW9uUmVzcG9uc2UgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtbGFtYmRhJztcbmltcG9ydCB7IE5vZGVIdHRwSGFuZGxlciB9IGZyb20gJ0Bhd3Mtc2RrL25vZGUtaHR0cC1oYW5kbGVyJztcblxuZXhwb3J0IHR5cGUgSW52b2tlRnVuY3Rpb24gPSAoZnVuY3Rpb25OYW1lOiBzdHJpbmcsIGludm9jYXRpb25UeXBlOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlcikgPT4gUHJvbWlzZTxJbnZvY2F0aW9uUmVzcG9uc2U+O1xuXG5leHBvcnQgY29uc3QgaW52b2tlOiBJbnZva2VGdW5jdGlvbiA9IGFzeW5jIChmdW5jdGlvbk5hbWUsIGludm9jYXRpb25UeXBlLCB0aW1lb3V0KSA9PiB7XG4gIGNvbnN0IGxhbWJkYSA9IG5ldyBMYW1iZGEoe1xuICAgIHJlcXVlc3RIYW5kbGVyOiBuZXcgTm9kZUh0dHBIYW5kbGVyKHtcbiAgICAgIHNvY2tldFRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgfSksXG4gIH0pO1xuXG4gIGNvbnN0IGludm9rZVJlcXVlc3QgPSB7IEZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLCBJbnZvY2F0aW9uVHlwZTogaW52b2NhdGlvblR5cGUgfTtcbiAgY29uc29sZS5sb2coeyBpbnZva2VSZXF1ZXN0IH0pO1xuXG4gIC8vIElBTSBwb2xpY3kgY2hhbmdlcyBjYW4gdGFrZSBzb21lIHRpbWUgdG8gZnVsbHkgcHJvcGFnYXRlXG4gIC8vIFRoZXJlZm9yZSwgcmV0cnkgZm9yIHVwIHRvIG9uZSBtaW51dGVcblxuICBsZXQgcmV0cnlDb3VudCA9IDA7XG4gIGNvbnN0IGRlbGF5ID0gNTAwMDtcblxuICBsZXQgaW52b2tlUmVzcG9uc2U7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGludm9rZVJlc3BvbnNlID0gYXdhaXQgbGFtYmRhLmludm9rZShpbnZva2VSZXF1ZXN0KTtcbiAgICAgIGJyZWFrO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBY2Nlc3NEZW5pZWRFeGNlcHRpb24gJiYgcmV0cnlDb3VudCA8IDEyKSB7XG4gICAgICAgIHJldHJ5Q291bnQrKztcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmxvZyh7IGludm9rZVJlc3BvbnNlIH0pO1xuICByZXR1cm4gaW52b2tlUmVzcG9uc2U7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zb2xlLmxvZyh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSk7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGNvbnNvbGUubG9nKCdub3QgY2FsbGluZyB0cmlnZ2VyIG9uIERFTEVURScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgPT09ICdmYWxzZScpIHtcbiAgICBjb25zb2xlLmxvZygnbm90IGNhbGxpbmcgdHJpZ2dlciBiZWNhdXNlIEV4ZWN1dGVPbkhhbmRsZXJDaGFuZ2UgaXMgZmFsc2UnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBoYW5kbGVyQXJuID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhhbmRsZXJBcm47XG4gIGlmICghaGFuZGxlckFybikge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiSGFuZGxlckFyblwiIHByb3BlcnR5IGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCBpbnZvY2F0aW9uVHlwZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnZvY2F0aW9uVHlwZTtcbiAgY29uc3QgdGltZW91dCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UaW1lb3V0O1xuXG4gIGNvbnN0IHBhcnNlZFRpbWVvdXQgPSBwYXJzZUludCh0aW1lb3V0KTtcbiAgaWYgKGlzTmFOKHBhcnNlZFRpbWVvdXQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCJUaW1lb3V0XCIgcHJvcGVydHkgd2l0aCB2YWx1ZSAke3RpbWVvdXR9IGlzIG5vdCBwYXJzZWFibGUgdG8gYSBudW1iZXJgKTtcbiAgfVxuXG4gIGNvbnN0IGludm9rZVJlc3BvbnNlID0gYXdhaXQgaW52b2tlKGhhbmRsZXJBcm4sIGludm9jYXRpb25UeXBlLCBwYXJzZWRUaW1lb3V0KTtcblxuICBpZiAoaW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZSAmJiBpbnZva2VSZXNwb25zZS5TdGF0dXNDb2RlID49IDQwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVHJpZ2dlciBoYW5kbGVyIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7aW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZX1gKTtcbiAgfVxuXG4gIC8vIGlmIHRoZSBsYW1iZGEgZnVuY3Rpb24gdGhyb3dzIGFuIGVycm9yLCBwYXJzZSB0aGUgZXJyb3IgbWVzc2FnZSBhbmQgZmFpbFxuICBpZiAoaW52b2tlUmVzcG9uc2UuRnVuY3Rpb25FcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihwYXJzZUVycm9yKGludm9rZVJlc3BvbnNlLlBheWxvYWQ/LnRvU3RyaW5nKCkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBlcnJvciBtZXNzYWdlIGZyb20gdGhlIGxhbWJkYSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gcGFyc2VFcnJvcihwYXlsb2FkOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zb2xlLmxvZyhgRXJyb3IgcGF5bG9hZDogJHtwYXlsb2FkfWApO1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gJ3Vua25vd24gaGFuZGxlciBlcnJvcic7XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBlcnJvciA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgY29uc3QgY29uY2F0ID0gW2Vycm9yLmVycm9yTWVzc2FnZSwgZXJyb3IudHJhY2VdLmZpbHRlcih4ID0+IHgpLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBjb25jYXQubGVuZ3RoID4gMCA/IGNvbmNhdCA6IHBheWxvYWQ7XG4gIH0gY2F0Y2gge1xuICAgIC8vIGZhbGwgYmFjayB0byBqdXN0IHJldHVybmluZyB0aGUgcGF5bG9hZFxuICAgIHJldHVybiBwYXlsb2FkO1xuICB9XG59XG4iXX0=