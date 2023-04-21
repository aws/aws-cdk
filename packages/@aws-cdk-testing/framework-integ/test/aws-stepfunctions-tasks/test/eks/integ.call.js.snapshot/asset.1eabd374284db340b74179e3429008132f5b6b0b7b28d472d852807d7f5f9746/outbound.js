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
    catch {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwrQkFBK0I7QUFJL0IsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUF5QjtJQUN6QyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUU7Q0FDcEQsQ0FBQztBQUVGLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUE2QixFQUFFLFlBQW9CO0lBQ25GLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBSSxHQUFzQixDQUFDO0FBQzNCLElBQUksTUFBa0IsQ0FBQztBQUV2QixLQUFLLFVBQVUscUJBQXFCLENBQUMsR0FBMEM7SUFDN0UsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDM0M7SUFFRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0MsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUFpQztJQUNwRSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN2QztJQUVELElBQUk7UUFDRjs7Ozs7Ozs7O1dBU0c7UUFDSCxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMzQztJQUFDLE1BQU07UUFFTjs7Ozs7V0FLRztRQUNILE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtZQUN2QyxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7U0FDL0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDM0M7QUFDSCxDQUFDO0FBRVUsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxXQUFXLEdBQUcsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHR5cGUgeyBDb25maWd1cmF0aW9uT3B0aW9ucyB9IGZyb20gJ2F3cy1zZGsvbGliL2NvbmZpZy1iYXNlJztcblxuY29uc3QgRlJBTUVXT1JLX0hBTkRMRVJfVElNRU9VVCA9IDkwMDAwMDsgLy8gMTUgbWludXRlc1xuXG4vLyBJbiBvcmRlciB0byBob25vciB0aGUgb3ZlcmFsbCBtYXhpbXVtIHRpbWVvdXQgc2V0IGZvciB0aGUgdGFyZ2V0IHByb2Nlc3MsXG4vLyB0aGUgZGVmYXVsdCAyIG1pbnV0ZXMgZnJvbSBBV1MgU0RLIGhhcyB0byBiZSBvdmVycmlkZW46XG4vLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy9sYXRlc3QvQVdTL0NvbmZpZy5odG1sI2h0dHBPcHRpb25zLXByb3BlcnR5XG5jb25zdCBhd3NTZGtDb25maWc6IENvbmZpZ3VyYXRpb25PcHRpb25zID0ge1xuICBodHRwT3B0aW9uczogeyB0aW1lb3V0OiBGUkFNRVdPUktfSEFORExFUl9USU1FT1VUIH0sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SHR0cFJlcXVlc3Qob3B0aW9uczogaHR0cHMuUmVxdWVzdE9wdGlvbnMsIHJlc3BvbnNlQm9keTogc3RyaW5nKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn1cblxubGV0IHNmbjogQVdTLlN0ZXBGdW5jdGlvbnM7XG5sZXQgbGFtYmRhOiBBV1MuTGFtYmRhO1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0U3RhcnRFeGVjdXRpb24ocmVxOiBBV1MuU3RlcEZ1bmN0aW9ucy5TdGFydEV4ZWN1dGlvbklucHV0KTogUHJvbWlzZTxBV1MuU3RlcEZ1bmN0aW9ucy5TdGFydEV4ZWN1dGlvbk91dHB1dD4ge1xuICBpZiAoIXNmbikge1xuICAgIHNmbiA9IG5ldyBBV1MuU3RlcEZ1bmN0aW9ucyhhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgcmV0dXJuIHNmbi5zdGFydEV4ZWN1dGlvbihyZXEpLnByb21pc2UoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdEludm9rZUZ1bmN0aW9uKHJlcTogQVdTLkxhbWJkYS5JbnZvY2F0aW9uUmVxdWVzdCk6IFByb21pc2U8QVdTLkxhbWJkYS5JbnZvY2F0aW9uUmVzcG9uc2U+IHtcbiAgaWYgKCFsYW1iZGEpIHtcbiAgICBsYW1iZGEgPSBuZXcgQVdTLkxhbWJkYShhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvKipcbiAgICAgKiBUcnkgYW4gaW5pdGlhbCBpbnZva2UuXG4gICAgICpcbiAgICAgKiBXaGVuIHlvdSB0cnkgdG8gaW52b2tlIGEgZnVuY3Rpb24gdGhhdCBpcyBpbmFjdGl2ZSwgdGhlIGludm9jYXRpb24gZmFpbHMgYW5kIExhbWJkYSBzZXRzXG4gICAgICogdGhlIGZ1bmN0aW9uIHRvIHBlbmRpbmcgc3RhdGUgdW50aWwgdGhlIGZ1bmN0aW9uIHJlc291cmNlcyBhcmUgcmVjcmVhdGVkLlxuICAgICAqIElmIExhbWJkYSBmYWlscyB0byByZWNyZWF0ZSB0aGUgcmVzb3VyY2VzLCB0aGUgZnVuY3Rpb24gaXMgc2V0IHRvIHRoZSBpbmFjdGl2ZSBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFdlJ3JlIHVzaW5nIGludm9rZSBmaXJzdCBiZWNhdXNlIGB3YWl0Rm9yYCBkb2Vzbid0IHRyaWdnZXIgYW4gaW5hY3RpdmUgZnVuY3Rpb24gdG8gZG8gYW55dGhpbmcsXG4gICAgICogaXQganVzdCBydW5zIGBnZXRGdW5jdGlvbmAgYW5kIGNoZWNrcyB0aGUgc3RhdGUuXG4gICAgICovXG4gICAgcmV0dXJuIGF3YWl0IGxhbWJkYS5pbnZva2UocmVxKS5wcm9taXNlKCk7XG4gIH0gY2F0Y2gge1xuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YXR1cyBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uIGlzIGNoZWNrZWQgZXZlcnkgc2Vjb25kIGZvciB1cCB0byAzMDAgc2Vjb25kcy5cbiAgICAgKiBFeGl0cyB0aGUgbG9vcCBvbiAnQWN0aXZlJyBzdGF0ZSBhbmQgdGhyb3dzIGFuIGVycm9yIG9uICdJbmFjdGl2ZScgb3IgJ0ZhaWxlZCcuXG4gICAgICpcbiAgICAgKiBBbmQgbm93IHdlIHdhaXQuXG4gICAgICovXG4gICAgYXdhaXQgbGFtYmRhLndhaXRGb3IoJ2Z1bmN0aW9uQWN0aXZlVjInLCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHJlcS5GdW5jdGlvbk5hbWUsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSkucHJvbWlzZSgpO1xuICB9XG59XG5cbmV4cG9ydCBsZXQgc3RhcnRFeGVjdXRpb24gPSBkZWZhdWx0U3RhcnRFeGVjdXRpb247XG5leHBvcnQgbGV0IGludm9rZUZ1bmN0aW9uID0gZGVmYXVsdEludm9rZUZ1bmN0aW9uO1xuZXhwb3J0IGxldCBodHRwUmVxdWVzdCA9IGRlZmF1bHRIdHRwUmVxdWVzdDtcbiJdfQ==