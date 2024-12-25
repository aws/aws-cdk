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
async function defaultHttpRequest(options, requestBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, (response) => {
                response.resume(); // Consume the response but don't care about it
                if (!response.statusCode || response.statusCode >= 400) {
                    reject(new Error(`Unsuccessful HTTP response: ${response.statusCode}`));
                }
                else {
                    resolve();
                }
            });
            request.on('error', reject);
            request.write(requestBody);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCwwREFBbUg7QUFDbkgsNkRBQTZEO0FBQzdELG9EQUFxRjtBQUNyRiw2REFBNkQ7QUFFN0QsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUFHO0lBQ25CLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRTtDQUNwRCxDQUFDO0FBRUYsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQTZCLEVBQUUsV0FBbUI7SUFDbEYsT0FBTyxJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNsRCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQywrQ0FBK0M7Z0JBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ3ZELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQywrQkFBK0IsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUUsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0IsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1osQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksR0FBUSxDQUFDO0FBQ2IsSUFBSSxNQUFjLENBQUM7QUFFbkIsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXdCO0lBQzNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULEdBQUcsR0FBRyxJQUFJLGdCQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELE9BQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXVCO0lBQzFELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNaLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQUksQ0FBQztRQUNIOzs7Ozs7Ozs7V0FTRztRQUNILE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFBQyxNQUFNLENBQUM7UUFDUDs7Ozs7V0FLRztRQUNILE1BQU0sSUFBQSx5Q0FBeUIsRUFBQztZQUM5QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRSxHQUFHO1NBQ2pCLEVBQUU7WUFDRCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztBQUNILENBQUM7QUFFVSxRQUFBLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQztBQUN2QyxRQUFBLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQztBQUN2QyxRQUFBLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5pbXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBMYW1iZGEsIHdhaXRVbnRpbEZ1bmN0aW9uQWN0aXZlVjIsIEludm9jYXRpb25SZXNwb25zZSwgSW52b2tlQ29tbWFuZElucHV0IH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTRk4sIFN0YXJ0RXhlY3V0aW9uSW5wdXQsIFN0YXJ0RXhlY3V0aW9uT3V0cHV0IH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNmbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmNvbnN0IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgPSA5MDAwMDA7IC8vIDE1IG1pbnV0ZXNcblxuLy8gSW4gb3JkZXIgdG8gaG9ub3IgdGhlIG92ZXJhbGwgbWF4aW11bSB0aW1lb3V0IHNldCBmb3IgdGhlIHRhcmdldCBwcm9jZXNzLFxuLy8gdGhlIGRlZmF1bHQgMiBtaW51dGVzIGZyb20gQVdTIFNESyBoYXMgdG8gYmUgb3ZlcnJpZGVuOlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Db25maWcuaHRtbCNodHRwT3B0aW9ucy1wcm9wZXJ0eVxuY29uc3QgYXdzU2RrQ29uZmlnID0ge1xuICBodHRwT3B0aW9uczogeyB0aW1lb3V0OiBGUkFNRVdPUktfSEFORExFUl9USU1FT1VUIH0sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SHR0cFJlcXVlc3Qob3B0aW9uczogaHR0cHMuUmVxdWVzdE9wdGlvbnMsIHJlcXVlc3RCb2R5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJlc3BvbnNlLnJlc3VtZSgpOyAvLyBDb25zdW1lIHRoZSByZXNwb25zZSBidXQgZG9uJ3QgY2FyZSBhYm91dCBpdFxuICAgICAgICBpZiAoIXJlc3BvbnNlLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZTogJHtyZXNwb25zZS5zdGF0dXNDb2RlfWApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXF1ZXN0Qm9keSk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgc2ZuOiBTRk47XG5sZXQgbGFtYmRhOiBMYW1iZGE7XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRTdGFydEV4ZWN1dGlvbihyZXE6IFN0YXJ0RXhlY3V0aW9uSW5wdXQpOiBQcm9taXNlPFN0YXJ0RXhlY3V0aW9uT3V0cHV0PiB7XG4gIGlmICghc2ZuKSB7XG4gICAgc2ZuID0gbmV3IFNGTihhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgcmV0dXJuIHNmbi5zdGFydEV4ZWN1dGlvbihyZXEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SW52b2tlRnVuY3Rpb24ocmVxOiBJbnZva2VDb21tYW5kSW5wdXQpOiBQcm9taXNlPEludm9jYXRpb25SZXNwb25zZT4ge1xuICBpZiAoIWxhbWJkYSkge1xuICAgIGxhbWJkYSA9IG5ldyBMYW1iZGEoYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLyoqXG4gICAgICogVHJ5IGFuIGluaXRpYWwgaW52b2tlLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgdHJ5IHRvIGludm9rZSBhIGZ1bmN0aW9uIHRoYXQgaXMgaW5hY3RpdmUsIHRoZSBpbnZvY2F0aW9uIGZhaWxzIGFuZCBMYW1iZGEgc2V0c1xuICAgICAqIHRoZSBmdW5jdGlvbiB0byBwZW5kaW5nIHN0YXRlIHVudGlsIHRoZSBmdW5jdGlvbiByZXNvdXJjZXMgYXJlIHJlY3JlYXRlZC5cbiAgICAgKiBJZiBMYW1iZGEgZmFpbHMgdG8gcmVjcmVhdGUgdGhlIHJlc291cmNlcywgdGhlIGZ1bmN0aW9uIGlzIHNldCB0byB0aGUgaW5hY3RpdmUgc3RhdGUuXG4gICAgICpcbiAgICAgKiBXZSdyZSB1c2luZyBpbnZva2UgZmlyc3QgYmVjYXVzZSBgd2FpdEZvcmAgZG9lc24ndCB0cmlnZ2VyIGFuIGluYWN0aXZlIGZ1bmN0aW9uIHRvIGRvIGFueXRoaW5nLFxuICAgICAqIGl0IGp1c3QgcnVucyBgZ2V0RnVuY3Rpb25gIGFuZCBjaGVja3MgdGhlIHN0YXRlLlxuICAgICAqL1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSk7XG4gIH0gY2F0Y2gge1xuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0dXMgb2YgdGhlIExhbWJkYSBmdW5jdGlvbiBpcyBjaGVja2VkIGV2ZXJ5IHNlY29uZCBmb3IgdXAgdG8gMzAwIHNlY29uZHMuXG4gICAgICogRXhpdHMgdGhlIGxvb3Agb24gJ0FjdGl2ZScgc3RhdGUgYW5kIHRocm93cyBhbiBlcnJvciBvbiAnSW5hY3RpdmUnIG9yICdGYWlsZWQnLlxuICAgICAqXG4gICAgICogQW5kIG5vdyB3ZSB3YWl0LlxuICAgICAqL1xuICAgIGF3YWl0IHdhaXRVbnRpbEZ1bmN0aW9uQWN0aXZlVjIoe1xuICAgICAgY2xpZW50OiBsYW1iZGEsXG4gICAgICBtYXhXYWl0VGltZTogMzAwLFxuICAgIH0sIHtcbiAgICAgIEZ1bmN0aW9uTmFtZTogcmVxLkZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gYXdhaXQgbGFtYmRhLmludm9rZShyZXEpO1xuICB9XG59XG5cbmV4cG9ydCBsZXQgc3RhcnRFeGVjdXRpb24gPSBkZWZhdWx0U3RhcnRFeGVjdXRpb247XG5leHBvcnQgbGV0IGludm9rZUZ1bmN0aW9uID0gZGVmYXVsdEludm9rZUZ1bmN0aW9uO1xuZXhwb3J0IGxldCBodHRwUmVxdWVzdCA9IGRlZmF1bHRIdHRwUmVxdWVzdDtcbiJdfQ==