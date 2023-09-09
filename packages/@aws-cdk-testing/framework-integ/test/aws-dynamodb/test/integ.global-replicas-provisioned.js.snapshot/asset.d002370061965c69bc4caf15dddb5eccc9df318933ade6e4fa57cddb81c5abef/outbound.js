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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwwREFBbUg7QUFDbkgsNkRBQTZEO0FBQzdELG9EQUFxRjtBQUNyRiw2REFBNkQ7QUFFN0QsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUFHO0lBQ25CLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRTtDQUNwRCxDQUFDO0FBRUYsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQTZCLEVBQUUsWUFBb0I7SUFDbkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksTUFBYyxDQUFDO0FBRW5CLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUF3QjtJQUMzRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsR0FBRyxHQUFHLElBQUksZ0JBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtJQUVELE9BQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXVCO0lBQzFELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUcsSUFBSSxzQkFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ25DO0lBRUQsSUFBSTtRQUNGOzs7Ozs7Ozs7V0FTRztRQUNILE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDO0lBQUMsTUFBTTtRQUNOOzs7OztXQUtHO1FBQ0gsTUFBTSxJQUFBLHlDQUF5QixFQUFDO1lBQzlCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLEdBQUc7U0FDakIsRUFBRTtZQUNELFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWTtTQUMvQixDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQztBQUNILENBQUM7QUFFVSxRQUFBLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQztBQUN2QyxRQUFBLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQztBQUN2QyxRQUFBLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5pbXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBMYW1iZGEsIHdhaXRVbnRpbEZ1bmN0aW9uQWN0aXZlVjIsIEludm9jYXRpb25SZXNwb25zZSwgSW52b2tlQ29tbWFuZElucHV0IH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTRk4sIFN0YXJ0RXhlY3V0aW9uSW5wdXQsIFN0YXJ0RXhlY3V0aW9uT3V0cHV0IH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNmbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmNvbnN0IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgPSA5MDAwMDA7IC8vIDE1IG1pbnV0ZXNcblxuLy8gSW4gb3JkZXIgdG8gaG9ub3IgdGhlIG92ZXJhbGwgbWF4aW11bSB0aW1lb3V0IHNldCBmb3IgdGhlIHRhcmdldCBwcm9jZXNzLFxuLy8gdGhlIGRlZmF1bHQgMiBtaW51dGVzIGZyb20gQVdTIFNESyBoYXMgdG8gYmUgb3ZlcnJpZGVuOlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Db25maWcuaHRtbCNodHRwT3B0aW9ucy1wcm9wZXJ0eVxuY29uc3QgYXdzU2RrQ29uZmlnID0ge1xuICBodHRwT3B0aW9uczogeyB0aW1lb3V0OiBGUkFNRVdPUktfSEFORExFUl9USU1FT1VUIH0sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SHR0cFJlcXVlc3Qob3B0aW9uczogaHR0cHMuUmVxdWVzdE9wdGlvbnMsIHJlc3BvbnNlQm9keTogc3RyaW5nKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn1cblxubGV0IHNmbjogU0ZOO1xubGV0IGxhbWJkYTogTGFtYmRhO1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0U3RhcnRFeGVjdXRpb24ocmVxOiBTdGFydEV4ZWN1dGlvbklucHV0KTogUHJvbWlzZTxTdGFydEV4ZWN1dGlvbk91dHB1dD4ge1xuICBpZiAoIXNmbikge1xuICAgIHNmbiA9IG5ldyBTRk4oYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHJldHVybiBzZm4uc3RhcnRFeGVjdXRpb24ocmVxKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVmYXVsdEludm9rZUZ1bmN0aW9uKHJlcTogSW52b2tlQ29tbWFuZElucHV0KTogUHJvbWlzZTxJbnZvY2F0aW9uUmVzcG9uc2U+IHtcbiAgaWYgKCFsYW1iZGEpIHtcbiAgICBsYW1iZGEgPSBuZXcgTGFtYmRhKGF3c1Nka0NvbmZpZyk7XG4gIH1cblxuICB0cnkge1xuICAgIC8qKlxuICAgICAqIFRyeSBhbiBpbml0aWFsIGludm9rZS5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IHRyeSB0byBpbnZva2UgYSBmdW5jdGlvbiB0aGF0IGlzIGluYWN0aXZlLCB0aGUgaW52b2NhdGlvbiBmYWlscyBhbmQgTGFtYmRhIHNldHNcbiAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcGVuZGluZyBzdGF0ZSB1bnRpbCB0aGUgZnVuY3Rpb24gcmVzb3VyY2VzIGFyZSByZWNyZWF0ZWQuXG4gICAgICogSWYgTGFtYmRhIGZhaWxzIHRvIHJlY3JlYXRlIHRoZSByZXNvdXJjZXMsIHRoZSBmdW5jdGlvbiBpcyBzZXQgdG8gdGhlIGluYWN0aXZlIHN0YXRlLlxuICAgICAqXG4gICAgICogV2UncmUgdXNpbmcgaW52b2tlIGZpcnN0IGJlY2F1c2UgYHdhaXRGb3JgIGRvZXNuJ3QgdHJpZ2dlciBhbiBpbmFjdGl2ZSBmdW5jdGlvbiB0byBkbyBhbnl0aGluZyxcbiAgICAgKiBpdCBqdXN0IHJ1bnMgYGdldEZ1bmN0aW9uYCBhbmQgY2hlY2tzIHRoZSBzdGF0ZS5cbiAgICAgKi9cbiAgICByZXR1cm4gYXdhaXQgbGFtYmRhLmludm9rZShyZXEpO1xuICB9IGNhdGNoIHtcbiAgICAvKipcbiAgICAgKiBUaGUgc3RhdHVzIG9mIHRoZSBMYW1iZGEgZnVuY3Rpb24gaXMgY2hlY2tlZCBldmVyeSBzZWNvbmQgZm9yIHVwIHRvIDMwMCBzZWNvbmRzLlxuICAgICAqIEV4aXRzIHRoZSBsb29wIG9uICdBY3RpdmUnIHN0YXRlIGFuZCB0aHJvd3MgYW4gZXJyb3Igb24gJ0luYWN0aXZlJyBvciAnRmFpbGVkJy5cbiAgICAgKlxuICAgICAqIEFuZCBub3cgd2Ugd2FpdC5cbiAgICAgKi9cbiAgICBhd2FpdCB3YWl0VW50aWxGdW5jdGlvbkFjdGl2ZVYyKHtcbiAgICAgIGNsaWVudDogbGFtYmRhLFxuICAgICAgbWF4V2FpdFRpbWU6IDMwMCxcbiAgICB9LCB7XG4gICAgICBGdW5jdGlvbk5hbWU6IHJlcS5GdW5jdGlvbk5hbWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGF3YWl0IGxhbWJkYS5pbnZva2UocmVxKTtcbiAgfVxufVxuXG5leHBvcnQgbGV0IHN0YXJ0RXhlY3V0aW9uID0gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uO1xuZXhwb3J0IGxldCBpbnZva2VGdW5jdGlvbiA9IGRlZmF1bHRJbnZva2VGdW5jdGlvbjtcbmV4cG9ydCBsZXQgaHR0cFJlcXVlc3QgPSBkZWZhdWx0SHR0cFJlcXVlc3Q7XG4iXX0=