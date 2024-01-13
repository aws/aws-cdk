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
         */
        await (0, client_lambda_1.waitUntilFunctionActiveV2)({
            client: lambda,
            maxWaitTime: 300,
        }, {
            FunctionName: req.FunctionName,
        });
        return await lambda.invoke(req);
    }
}
exports.startExecution = defaultStartExecution;
exports.invokeFunction = defaultInvokeFunction;
exports.httpRequest = defaultHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwwREFBbUg7QUFDbkgsNkRBQTZEO0FBQzdELG9EQUFxRjtBQUNyRiw2REFBNkQ7QUFFN0QsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUFHO0lBQ25CLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRTtDQUNwRCxDQUFDO0FBRUYsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQTZCLEVBQUUsWUFBb0I7SUFDbkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRCxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksTUFBYyxDQUFDO0FBRW5CLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUF3QjtJQUMzRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxHQUFHLEdBQUcsSUFBSSxnQkFBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUF1QjtJQUMxRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixNQUFNLEdBQUcsSUFBSSxzQkFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSDs7Ozs7Ozs7O1dBU0c7UUFDSCxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1A7Ozs7O1dBS0c7UUFDSCxNQUFNLElBQUEseUNBQXlCLEVBQUM7WUFDOUIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsR0FBRztTQUNqQixFQUFFO1lBQ0QsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1NBQy9CLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBRVUsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxXQUFXLEdBQUcsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgTGFtYmRhLCB3YWl0VW50aWxGdW5jdGlvbkFjdGl2ZVYyLCBJbnZvY2F0aW9uUmVzcG9uc2UsIEludm9rZUNvbW1hbmRJbnB1dCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1sYW1iZGEnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgU0ZOLCBTdGFydEV4ZWN1dGlvbklucHV0LCBTdGFydEV4ZWN1dGlvbk91dHB1dCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zZm4nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5jb25zdCBGUkFNRVdPUktfSEFORExFUl9USU1FT1VUID0gOTAwMDAwOyAvLyAxNSBtaW51dGVzXG5cbi8vIEluIG9yZGVyIHRvIGhvbm9yIHRoZSBvdmVyYWxsIG1heGltdW0gdGltZW91dCBzZXQgZm9yIHRoZSB0YXJnZXQgcHJvY2Vzcyxcbi8vIHRoZSBkZWZhdWx0IDIgbWludXRlcyBmcm9tIEFXUyBTREsgaGFzIHRvIGJlIG92ZXJyaWRlbjpcbi8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvQ29uZmlnLmh0bWwjaHR0cE9wdGlvbnMtcHJvcGVydHlcbmNvbnN0IGF3c1Nka0NvbmZpZyA9IHtcbiAgaHR0cE9wdGlvbnM6IHsgdGltZW91dDogRlJBTUVXT1JLX0hBTkRMRVJfVElNRU9VVCB9LFxufTtcblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdEh0dHBSZXF1ZXN0KG9wdGlvbnM6IGh0dHBzLlJlcXVlc3RPcHRpb25zLCByZXNwb25zZUJvZHk6IHN0cmluZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCByZXNvbHZlKTtcbiAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmxldCBzZm46IFNGTjtcbmxldCBsYW1iZGE6IExhbWJkYTtcblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uKHJlcTogU3RhcnRFeGVjdXRpb25JbnB1dCk6IFByb21pc2U8U3RhcnRFeGVjdXRpb25PdXRwdXQ+IHtcbiAgaWYgKCFzZm4pIHtcbiAgICBzZm4gPSBuZXcgU0ZOKGF3c1Nka0NvbmZpZyk7XG4gIH1cblxuICByZXR1cm4gc2ZuLnN0YXJ0RXhlY3V0aW9uKHJlcSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRJbnZva2VGdW5jdGlvbihyZXE6IEludm9rZUNvbW1hbmRJbnB1dCk6IFByb21pc2U8SW52b2NhdGlvblJlc3BvbnNlPiB7XG4gIGlmICghbGFtYmRhKSB7XG4gICAgbGFtYmRhID0gbmV3IExhbWJkYShhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvKipcbiAgICAgKiBUcnkgYW4gaW5pdGlhbCBpbnZva2UuXG4gICAgICpcbiAgICAgKiBXaGVuIHlvdSB0cnkgdG8gaW52b2tlIGEgZnVuY3Rpb24gdGhhdCBpcyBpbmFjdGl2ZSwgdGhlIGludm9jYXRpb24gZmFpbHMgYW5kIExhbWJkYSBzZXRzXG4gICAgICogdGhlIGZ1bmN0aW9uIHRvIHBlbmRpbmcgc3RhdGUgdW50aWwgdGhlIGZ1bmN0aW9uIHJlc291cmNlcyBhcmUgcmVjcmVhdGVkLlxuICAgICAqIElmIExhbWJkYSBmYWlscyB0byByZWNyZWF0ZSB0aGUgcmVzb3VyY2VzLCB0aGUgZnVuY3Rpb24gaXMgc2V0IHRvIHRoZSBpbmFjdGl2ZSBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFdlJ3JlIHVzaW5nIGludm9rZSBmaXJzdCBiZWNhdXNlIGB3YWl0Rm9yYCBkb2Vzbid0IHRyaWdnZXIgYW4gaW5hY3RpdmUgZnVuY3Rpb24gdG8gZG8gYW55dGhpbmcsXG4gICAgICogaXQganVzdCBydW5zIGBnZXRGdW5jdGlvbmAgYW5kIGNoZWNrcyB0aGUgc3RhdGUuXG4gICAgICovXG4gICAgcmV0dXJuIGF3YWl0IGxhbWJkYS5pbnZva2UocmVxKTtcbiAgfSBjYXRjaCB7XG4gICAgLyoqXG4gICAgICogVGhlIHN0YXR1cyBvZiB0aGUgTGFtYmRhIGZ1bmN0aW9uIGlzIGNoZWNrZWQgZXZlcnkgc2Vjb25kIGZvciB1cCB0byAzMDAgc2Vjb25kcy5cbiAgICAgKiBFeGl0cyB0aGUgbG9vcCBvbiAnQWN0aXZlJyBzdGF0ZSBhbmQgdGhyb3dzIGFuIGVycm9yIG9uICdJbmFjdGl2ZScgb3IgJ0ZhaWxlZCcuXG4gICAgICpcbiAgICAgKiBBbmQgbm93IHdlIHdhaXQuXG4gICAgICovXG4gICAgYXdhaXQgd2FpdFVudGlsRnVuY3Rpb25BY3RpdmVWMih7XG4gICAgICBjbGllbnQ6IGxhbWJkYSxcbiAgICAgIG1heFdhaXRUaW1lOiAzMDAsXG4gICAgfSwge1xuICAgICAgRnVuY3Rpb25OYW1lOiByZXEuRnVuY3Rpb25OYW1lLFxuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSk7XG4gIH1cbn1cblxuZXhwb3J0IGxldCBzdGFydEV4ZWN1dGlvbiA9IGRlZmF1bHRTdGFydEV4ZWN1dGlvbjtcbmV4cG9ydCBsZXQgaW52b2tlRnVuY3Rpb24gPSBkZWZhdWx0SW52b2tlRnVuY3Rpb247XG5leHBvcnQgbGV0IGh0dHBSZXF1ZXN0ID0gZGVmYXVsdEh0dHBSZXF1ZXN0O1xuIl19