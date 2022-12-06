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
    // IAM policy changes can take some time to fully propagate
    // Therefore, retry for up to one minute
    let retryCount = 0;
    const delay = 5000;
    let invokeResponse;
    while (true) {
        try {
            invokeResponse = await lambda.invoke(invokeRequest).promise();
            break;
        }
        catch (error) {
            if (error instanceof Error && error.code === 'AccessDeniedException' && retryCount < 12) {
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
async function handler(event) {
    console.log({ ...event, ResponseURL: '...' });
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
    catch (e) {
        // fall back to just returning the payload
        return payload;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQUlsQixRQUFBLE1BQU0sR0FBbUIsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFO0lBQzNELE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hDLE1BQU0sYUFBYSxHQUFHLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRS9CLDJEQUEyRDtJQUMzRCx3Q0FBd0M7SUFFeEMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztJQUVuQixJQUFJLGNBQWMsQ0FBQztJQUNuQixPQUFPLElBQUksRUFBRTtRQUNYLElBQUk7WUFDRixjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlELE1BQU07U0FDUDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxLQUFLLFlBQVksS0FBSyxJQUFLLEtBQXNCLENBQUMsSUFBSSxLQUFLLHVCQUF1QixJQUFJLFVBQVUsR0FBRyxFQUFFLEVBQUU7Z0JBQ3pHLFVBQVUsRUFBRSxDQUFDO2dCQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDNUIsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsU0FBUzthQUNWO1lBRUQsTUFBTSxLQUFLLENBQUM7U0FDYjtLQUNGO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDaEMsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFOUMsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0MsT0FBTztLQUNSO0lBRUQsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztJQUN2RCxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzFEO0lBRUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxjQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFaEQsSUFBSSxjQUFjLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtRQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUN6RjtJQUVELDJFQUEyRTtJQUMzRSxJQUFJLGNBQWMsQ0FBQyxhQUFhLEVBQUU7UUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDO0FBdkJELDBCQXVCQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxVQUFVLENBQUMsT0FBMkI7SUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQUUsT0FBTyx1QkFBdUIsQ0FBQztLQUFFO0lBQ2pELElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNFLE9BQU8sTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0tBQzdDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDViwwQ0FBMEM7UUFDMUMsT0FBTyxPQUFPLENBQUM7S0FDaEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uID0gKGZ1bmN0aW9uTmFtZTogc3RyaW5nKSA9PiBQcm9taXNlPEFXUy5MYW1iZGEuSW52b2NhdGlvblJlc3BvbnNlPjtcblxuZXhwb3J0IGNvbnN0IGludm9rZTogSW52b2tlRnVuY3Rpb24gPSBhc3luYyAoZnVuY3Rpb25OYW1lKSA9PiB7XG4gIGNvbnN0IGxhbWJkYSA9IG5ldyBBV1MuTGFtYmRhKCk7XG4gIGNvbnN0IGludm9rZVJlcXVlc3QgPSB7IEZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lIH07XG4gIGNvbnNvbGUubG9nKHsgaW52b2tlUmVxdWVzdCB9KTtcblxuICAvLyBJQU0gcG9saWN5IGNoYW5nZXMgY2FuIHRha2Ugc29tZSB0aW1lIHRvIGZ1bGx5IHByb3BhZ2F0ZVxuICAvLyBUaGVyZWZvcmUsIHJldHJ5IGZvciB1cCB0byBvbmUgbWludXRlXG5cbiAgbGV0IHJldHJ5Q291bnQgPSAwO1xuICBjb25zdCBkZWxheSA9IDUwMDA7XG5cbiAgbGV0IGludm9rZVJlc3BvbnNlO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICBpbnZva2VSZXNwb25zZSA9IGF3YWl0IGxhbWJkYS5pbnZva2UoaW52b2tlUmVxdWVzdCkucHJvbWlzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmIChlcnJvciBhcyBBV1MuQVdTRXJyb3IpLmNvZGUgPT09ICdBY2Nlc3NEZW5pZWRFeGNlcHRpb24nICYmIHJldHJ5Q291bnQgPCAxMikge1xuICAgICAgICByZXRyeUNvdW50Kys7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5sb2coeyBpbnZva2VSZXNwb25zZSB9KTtcbiAgcmV0dXJuIGludm9rZVJlc3BvbnNlO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc29sZS5sb2coeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pO1xuXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScpIHtcbiAgICBjb25zb2xlLmxvZygnbm90IGNhbGxpbmcgdHJpZ2dlciBvbiBERUxFVEUnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBoYW5kbGVyQXJuID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhhbmRsZXJBcm47XG4gIGlmICghaGFuZGxlckFybikge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiSGFuZGxlckFyblwiIHByb3BlcnR5IGlzIHJlcXVpcmVkJyk7XG4gIH1cblxuICBjb25zdCBpbnZva2VSZXNwb25zZSA9IGF3YWl0IGludm9rZShoYW5kbGVyQXJuKTtcblxuICBpZiAoaW52b2tlUmVzcG9uc2UuU3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUcmlnZ2VyIGhhbmRsZXIgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtpbnZva2VSZXNwb25zZS5TdGF0dXNDb2RlfWApO1xuICB9XG5cbiAgLy8gaWYgdGhlIGxhbWJkYSBmdW5jdGlvbiB0aHJvd3MgYW4gZXJyb3IsIHBhcnNlIHRoZSBlcnJvciBtZXNzYWdlIGFuZCBmYWlsXG4gIGlmIChpbnZva2VSZXNwb25zZS5GdW5jdGlvbkVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHBhcnNlRXJyb3IoaW52b2tlUmVzcG9uc2UuUGF5bG9hZD8udG9TdHJpbmcoKSkpO1xuICB9XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGVycm9yIG1lc3NhZ2UgZnJvbSB0aGUgbGFtYmRhIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBwYXJzZUVycm9yKHBheWxvYWQ6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnNvbGUubG9nKGBFcnJvciBwYXlsb2FkOiAke3BheWxvYWR9YCk7XG4gIGlmICghcGF5bG9hZCkgeyByZXR1cm4gJ3Vua25vd24gaGFuZGxlciBlcnJvcic7IH1cbiAgdHJ5IHtcbiAgICBjb25zdCBlcnJvciA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgY29uc3QgY29uY2F0ID0gW2Vycm9yLmVycm9yTWVzc2FnZSwgZXJyb3IudHJhY2VdLmZpbHRlcih4ID0+IHgpLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBjb25jYXQubGVuZ3RoID4gMCA/IGNvbmNhdCA6IHBheWxvYWQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBmYWxsIGJhY2sgdG8ganVzdCByZXR1cm5pbmcgdGhlIHBheWxvYWRcbiAgICByZXR1cm4gcGF5bG9hZDtcbiAgfVxufVxuIl19