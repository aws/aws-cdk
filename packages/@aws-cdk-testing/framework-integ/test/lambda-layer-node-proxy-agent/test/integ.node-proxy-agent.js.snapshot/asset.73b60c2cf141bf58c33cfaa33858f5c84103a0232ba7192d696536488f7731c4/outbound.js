"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = exports.invokeFunction = exports.startExecution = void 0;
/* istanbul ignore file */
const https = require("https");
// eslint-disable-next-line import/no-extraneous-dependencies
const client_lambda_1 = require("@aws-sdk/client-lambda");
// eslint-disable-next-line import/no-extraneous-dependencies
const client_sfn_1 = require("@aws-sdk/client-sfn");
// eslint-disable-next-line import/no-extraneous-dependencies
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
        sfn = new client_sfn_1.SFN(awsSdkConfig);
    }
    return sfn.startExecution(req);
}
async function defaultInvokeFunction(req) {
    if (!lambda) {
        lambda = new client_lambda_1.Lambda(awsSdkConfig);
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
        return await lambda.invoke(req);
    }
    catch {
        /**
         * The status of the Lambda function is checked every second for up to 300 seconds.
         * Exits the loop on 'Active' state and throws an error on 'Inactive' or 'Failed'.
         *
         * And now we wait.
         *
         * Use functionActive instead of functionActiveV2, since functionActiveV2 is only
         * available on SDK 2.1080.0 and up, Lambda installs 2.1055.0 by default,
         * and we use the SDK version that Lambda includes by default.
         */
        await (0, client_lambda_1.waitUntilFunctionActive)({
            client: lambda,
            maxWaitTime: 60,
        }, {
            FunctionName: req.FunctionName,
        });
        return await lambda.invoke(req);
    }
}
exports.startExecution = defaultStartExecution;
exports.invokeFunction = defaultInvokeFunction;
exports.httpRequest = defaultHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwwREFBaUg7QUFDakgsNkRBQTZEO0FBQzdELG9EQUFxRjtBQUNyRiw2REFBNkQ7QUFFN0QsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUFHO0lBQ25CLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRTtDQUNwRCxDQUFDO0FBRUYsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQTZCLEVBQUUsWUFBb0I7SUFDbkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksTUFBYyxDQUFDO0FBRW5CLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUF3QjtJQUMzRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsR0FBRyxHQUFHLElBQUksZ0JBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtJQUVELE9BQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXVCO0lBQzFELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUcsSUFBSSxzQkFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ25DO0lBRUQsSUFBSTtRQUNGOzs7Ozs7Ozs7V0FTRztRQUNILE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDO0lBQUMsTUFBTTtRQUVOOzs7Ozs7Ozs7V0FTRztRQUNILE1BQU0sSUFBQSx1Q0FBdUIsRUFBQztZQUM1QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRSxFQUFFO1NBQ2hCLEVBQUU7WUFDRCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDO0FBRVUsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxXQUFXLEdBQUcsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgTGFtYmRhLCB3YWl0VW50aWxGdW5jdGlvbkFjdGl2ZSwgSW52b2NhdGlvblJlc3BvbnNlLCBJbnZva2VDb21tYW5kSW5wdXQgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtbGFtYmRhJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFNGTiwgU3RhcnRFeGVjdXRpb25JbnB1dCwgU3RhcnRFeGVjdXRpb25PdXRwdXQgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtc2ZuJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuY29uc3QgRlJBTUVXT1JLX0hBTkRMRVJfVElNRU9VVCA9IDkwMDAwMDsgLy8gMTUgbWludXRlc1xuXG4vLyBJbiBvcmRlciB0byBob25vciB0aGUgb3ZlcmFsbCBtYXhpbXVtIHRpbWVvdXQgc2V0IGZvciB0aGUgdGFyZ2V0IHByb2Nlc3MsXG4vLyB0aGUgZGVmYXVsdCAyIG1pbnV0ZXMgZnJvbSBBV1MgU0RLIGhhcyB0byBiZSBvdmVycmlkZW46XG4vLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy9sYXRlc3QvQVdTL0NvbmZpZy5odG1sI2h0dHBPcHRpb25zLXByb3BlcnR5XG5jb25zdCBhd3NTZGtDb25maWcgPSB7XG4gIGh0dHBPcHRpb25zOiB7IHRpbWVvdXQ6IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgfSxcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRIdHRwUmVxdWVzdChvcHRpb25zOiBodHRwcy5SZXF1ZXN0T3B0aW9ucywgcmVzcG9uc2VCb2R5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgc2ZuOiBTRk47XG5sZXQgbGFtYmRhOiBMYW1iZGE7XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRTdGFydEV4ZWN1dGlvbihyZXE6IFN0YXJ0RXhlY3V0aW9uSW5wdXQpOiBQcm9taXNlPFN0YXJ0RXhlY3V0aW9uT3V0cHV0PiB7XG4gIGlmICghc2ZuKSB7XG4gICAgc2ZuID0gbmV3IFNGTihhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgcmV0dXJuIHNmbi5zdGFydEV4ZWN1dGlvbihyZXEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SW52b2tlRnVuY3Rpb24ocmVxOiBJbnZva2VDb21tYW5kSW5wdXQpOiBQcm9taXNlPEludm9jYXRpb25SZXNwb25zZT4ge1xuICBpZiAoIWxhbWJkYSkge1xuICAgIGxhbWJkYSA9IG5ldyBMYW1iZGEoYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLyoqXG4gICAgICogVHJ5IGFuIGluaXRpYWwgaW52b2tlLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgdHJ5IHRvIGludm9rZSBhIGZ1bmN0aW9uIHRoYXQgaXMgaW5hY3RpdmUsIHRoZSBpbnZvY2F0aW9uIGZhaWxzIGFuZCBMYW1iZGEgc2V0c1xuICAgICAqIHRoZSBmdW5jdGlvbiB0byBwZW5kaW5nIHN0YXRlIHVudGlsIHRoZSBmdW5jdGlvbiByZXNvdXJjZXMgYXJlIHJlY3JlYXRlZC5cbiAgICAgKiBJZiBMYW1iZGEgZmFpbHMgdG8gcmVjcmVhdGUgdGhlIHJlc291cmNlcywgdGhlIGZ1bmN0aW9uIGlzIHNldCB0byB0aGUgaW5hY3RpdmUgc3RhdGUuXG4gICAgICpcbiAgICAgKiBXZSdyZSB1c2luZyBpbnZva2UgZmlyc3QgYmVjYXVzZSBgd2FpdEZvcmAgZG9lc24ndCB0cmlnZ2VyIGFuIGluYWN0aXZlIGZ1bmN0aW9uIHRvIGRvIGFueXRoaW5nLFxuICAgICAqIGl0IGp1c3QgcnVucyBgZ2V0RnVuY3Rpb25gIGFuZCBjaGVja3MgdGhlIHN0YXRlLlxuICAgICAqL1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSk7XG4gIH0gY2F0Y2gge1xuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YXR1cyBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uIGlzIGNoZWNrZWQgZXZlcnkgc2Vjb25kIGZvciB1cCB0byAzMDAgc2Vjb25kcy5cbiAgICAgKiBFeGl0cyB0aGUgbG9vcCBvbiAnQWN0aXZlJyBzdGF0ZSBhbmQgdGhyb3dzIGFuIGVycm9yIG9uICdJbmFjdGl2ZScgb3IgJ0ZhaWxlZCcuXG4gICAgICpcbiAgICAgKiBBbmQgbm93IHdlIHdhaXQuXG4gICAgICpcbiAgICAgKiBVc2UgZnVuY3Rpb25BY3RpdmUgaW5zdGVhZCBvZiBmdW5jdGlvbkFjdGl2ZVYyLCBzaW5jZSBmdW5jdGlvbkFjdGl2ZVYyIGlzIG9ubHlcbiAgICAgKiBhdmFpbGFibGUgb24gU0RLIDIuMTA4MC4wIGFuZCB1cCwgTGFtYmRhIGluc3RhbGxzIDIuMTA1NS4wIGJ5IGRlZmF1bHQsXG4gICAgICogYW5kIHdlIHVzZSB0aGUgU0RLIHZlcnNpb24gdGhhdCBMYW1iZGEgaW5jbHVkZXMgYnkgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBhd2FpdCB3YWl0VW50aWxGdW5jdGlvbkFjdGl2ZSh7XG4gICAgICBjbGllbnQ6IGxhbWJkYSxcbiAgICAgIG1heFdhaXRUaW1lOiA2MCxcbiAgICB9LCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHJlcS5GdW5jdGlvbk5hbWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGF3YWl0IGxhbWJkYS5pbnZva2UocmVxKTtcbiAgfVxufVxuXG5leHBvcnQgbGV0IHN0YXJ0RXhlY3V0aW9uID0gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uO1xuZXhwb3J0IGxldCBpbnZva2VGdW5jdGlvbiA9IGRlZmF1bHRJbnZva2VGdW5jdGlvbjtcbmV4cG9ydCBsZXQgaHR0cFJlcXVlc3QgPSBkZWZhdWx0SHR0cFJlcXVlc3Q7XG4iXX0=