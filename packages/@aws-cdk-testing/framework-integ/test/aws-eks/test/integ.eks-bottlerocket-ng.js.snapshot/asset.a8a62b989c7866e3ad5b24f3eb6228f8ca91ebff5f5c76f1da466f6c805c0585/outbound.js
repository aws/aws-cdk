"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = exports.invokeFunction = exports.startExecution = void 0;
/* istanbul ignore file */
const https = require("https");
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require("aws-sdk");
const FRAMEWORK_HANDLER_TIMEOUT = 900000; // 15 minutes
// In order to honor the overall maximum timeout set for the target process,
// the default 2 minutes from AWS SDK has to be overriden:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#httpOptions-property
const awsSdkConfig = {
    httpOptions: { timeout: FRAMEWORK_HANDLER_TIMEOUT },
};
async function defaultHttpRequest(options, responseBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, resolve);
            request.on('error', reject);
            request.write(responseBody);
            request.end();
        }
        catch (e) {
            reject(e);
        }
    });
}
let sfn;
let lambda;
async function defaultStartExecution(req) {
    if (!sfn) {
        sfn = new AWS.StepFunctions(awsSdkConfig);
    }
    return sfn.startExecution(req).promise();
}
async function defaultInvokeFunction(req) {
    if (!lambda) {
        lambda = new AWS.Lambda(awsSdkConfig);
    }
    try {
        /**
         * Try an initial invoke.
         *
         * When you try to invoke a function that is inactive, the invocation fails and Lambda sets
         * the function to pending state until the function resources are recreated.
         * If Lambda fails to recreate the resources, the function is set to the inactive state.
         *
         * We're using invoke first because `waitFor` doesn't trigger an inactive function to do anything,
         * it just runs `getFunction` and checks the state.
         */
        return await lambda.invoke(req).promise();
    }
    catch (error) {
        /**
         * The status of the Lambda function is checked every second for up to 300 seconds.
         * Exits the loop on 'Active' state and throws an error on 'Inactive' or 'Failed'.
         *
         * And now we wait.
         */
        await lambda.waitFor('functionActiveV2', {
            FunctionName: req.FunctionName,
        }).promise();
        return await lambda.invoke(req).promise();
    }
}
exports.startExecution = defaultStartExecution;
exports.invokeFunction = defaultInvokeFunction;
exports.httpRequest = defaultHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwrQkFBK0I7QUFJL0IsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUF5QjtJQUN6QyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUU7Q0FDcEQsQ0FBQztBQUVGLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUE2QixFQUFFLFlBQW9CO0lBQ25GLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBSSxHQUFzQixDQUFDO0FBQzNCLElBQUksTUFBa0IsQ0FBQztBQUV2QixLQUFLLFVBQVUscUJBQXFCLENBQUMsR0FBMEM7SUFDN0UsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDM0M7SUFFRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0MsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUFpQztJQUNwRSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN2QztJQUVELElBQUk7UUFDRjs7Ozs7Ozs7O1dBU0c7UUFDSCxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMzQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBRWQ7Ozs7O1dBS0c7UUFDSCxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7WUFDdkMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1NBQy9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzNDO0FBQ0gsQ0FBQztBQUVVLFFBQUEsY0FBYyxHQUFHLHFCQUFxQixDQUFDO0FBQ3ZDLFFBQUEsY0FBYyxHQUFHLHFCQUFxQixDQUFDO0FBQ3ZDLFFBQUEsV0FBVyxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbmltcG9ydCAqIGFzIGh0dHBzIGZyb20gJ2h0dHBzJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB0eXBlIHsgQ29uZmlndXJhdGlvbk9wdGlvbnMgfSBmcm9tICdhd3Mtc2RrL2xpYi9jb25maWctYmFzZSc7XG5cbmNvbnN0IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgPSA5MDAwMDA7IC8vIDE1IG1pbnV0ZXNcblxuLy8gSW4gb3JkZXIgdG8gaG9ub3IgdGhlIG92ZXJhbGwgbWF4aW11bSB0aW1lb3V0IHNldCBmb3IgdGhlIHRhcmdldCBwcm9jZXNzLFxuLy8gdGhlIGRlZmF1bHQgMiBtaW51dGVzIGZyb20gQVdTIFNESyBoYXMgdG8gYmUgb3ZlcnJpZGVuOlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Db25maWcuaHRtbCNodHRwT3B0aW9ucy1wcm9wZXJ0eVxuY29uc3QgYXdzU2RrQ29uZmlnOiBDb25maWd1cmF0aW9uT3B0aW9ucyA9IHtcbiAgaHR0cE9wdGlvbnM6IHsgdGltZW91dDogRlJBTUVXT1JLX0hBTkRMRVJfVElNRU9VVCB9LFxufTtcblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdEh0dHBSZXF1ZXN0KG9wdGlvbnM6IGh0dHBzLlJlcXVlc3RPcHRpb25zLCByZXNwb25zZUJvZHk6IHN0cmluZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCByZXNvbHZlKTtcbiAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmxldCBzZm46IEFXUy5TdGVwRnVuY3Rpb25zO1xubGV0IGxhbWJkYTogQVdTLkxhbWJkYTtcblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uKHJlcTogQVdTLlN0ZXBGdW5jdGlvbnMuU3RhcnRFeGVjdXRpb25JbnB1dCk6IFByb21pc2U8QVdTLlN0ZXBGdW5jdGlvbnMuU3RhcnRFeGVjdXRpb25PdXRwdXQ+IHtcbiAgaWYgKCFzZm4pIHtcbiAgICBzZm4gPSBuZXcgQVdTLlN0ZXBGdW5jdGlvbnMoYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHJldHVybiBzZm4uc3RhcnRFeGVjdXRpb24ocmVxKS5wcm9taXNlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRJbnZva2VGdW5jdGlvbihyZXE6IEFXUy5MYW1iZGEuSW52b2NhdGlvblJlcXVlc3QpOiBQcm9taXNlPEFXUy5MYW1iZGEuSW52b2NhdGlvblJlc3BvbnNlPiB7XG4gIGlmICghbGFtYmRhKSB7XG4gICAgbGFtYmRhID0gbmV3IEFXUy5MYW1iZGEoYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLyoqXG4gICAgICogVHJ5IGFuIGluaXRpYWwgaW52b2tlLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgdHJ5IHRvIGludm9rZSBhIGZ1bmN0aW9uIHRoYXQgaXMgaW5hY3RpdmUsIHRoZSBpbnZvY2F0aW9uIGZhaWxzIGFuZCBMYW1iZGEgc2V0c1xuICAgICAqIHRoZSBmdW5jdGlvbiB0byBwZW5kaW5nIHN0YXRlIHVudGlsIHRoZSBmdW5jdGlvbiByZXNvdXJjZXMgYXJlIHJlY3JlYXRlZC5cbiAgICAgKiBJZiBMYW1iZGEgZmFpbHMgdG8gcmVjcmVhdGUgdGhlIHJlc291cmNlcywgdGhlIGZ1bmN0aW9uIGlzIHNldCB0byB0aGUgaW5hY3RpdmUgc3RhdGUuXG4gICAgICpcbiAgICAgKiBXZSdyZSB1c2luZyBpbnZva2UgZmlyc3QgYmVjYXVzZSBgd2FpdEZvcmAgZG9lc24ndCB0cmlnZ2VyIGFuIGluYWN0aXZlIGZ1bmN0aW9uIHRvIGRvIGFueXRoaW5nLFxuICAgICAqIGl0IGp1c3QgcnVucyBgZ2V0RnVuY3Rpb25gIGFuZCBjaGVja3MgdGhlIHN0YXRlLlxuICAgICAqL1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSkucHJvbWlzZSgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YXR1cyBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uIGlzIGNoZWNrZWQgZXZlcnkgc2Vjb25kIGZvciB1cCB0byAzMDAgc2Vjb25kcy5cbiAgICAgKiBFeGl0cyB0aGUgbG9vcCBvbiAnQWN0aXZlJyBzdGF0ZSBhbmQgdGhyb3dzIGFuIGVycm9yIG9uICdJbmFjdGl2ZScgb3IgJ0ZhaWxlZCcuXG4gICAgICpcbiAgICAgKiBBbmQgbm93IHdlIHdhaXQuXG4gICAgICovXG4gICAgYXdhaXQgbGFtYmRhLndhaXRGb3IoJ2Z1bmN0aW9uQWN0aXZlVjInLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHJlcS5GdW5jdGlvbk5hbWUsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSkucHJvbWlzZSgpO1xuICB9XG59XG5cbmV4cG9ydCBsZXQgc3RhcnRFeGVjdXRpb24gPSBkZWZhdWx0U3RhcnRFeGVjdXRpb247XG5leHBvcnQgbGV0IGludm9rZUZ1bmN0aW9uID0gZGVmYXVsdEludm9rZUZ1bmN0aW9uO1xuZXhwb3J0IGxldCBodHRwUmVxdWVzdCA9IGRlZmF1bHRIdHRwUmVxdWVzdDtcbiJdfQ==