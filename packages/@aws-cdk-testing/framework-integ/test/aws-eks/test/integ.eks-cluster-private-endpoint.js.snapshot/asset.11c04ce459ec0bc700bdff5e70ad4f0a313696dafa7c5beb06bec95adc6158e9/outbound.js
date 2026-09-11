"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParameter = exports.getParameter = exports.putParameter = exports.httpRequest = exports.invokeFunction = exports.startExecution = void 0;
/* istanbul ignore file */
const https = __importStar(require("https"));
// eslint-disable-next-line import/no-extraneous-dependencies
const client_lambda_1 = require("@aws-sdk/client-lambda");
// eslint-disable-next-line import/no-extraneous-dependencies
const client_sfn_1 = require("@aws-sdk/client-sfn");
// eslint-disable-next-line import/no-extraneous-dependencies
const client_ssm_1 = require("@aws-sdk/client-ssm");
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
let ssm;
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
        return lambda.invoke(req);
    }
}
function ssmClient() {
    if (!ssm) {
        ssm = new client_ssm_1.SSM(awsSdkConfig);
    }
    return ssm;
}
async function defaultPutParameter(req) {
    await ssmClient().putParameter(req);
}
async function defaultGetParameter(req) {
    const resp = await ssmClient().getParameter(req);
    return resp.Parameter?.Value;
}
async function defaultDeleteParameter(req) {
    await ssmClient().deleteParameter(req);
}
exports.startExecution = defaultStartExecution;
exports.invokeFunction = defaultInvokeFunction;
exports.httpRequest = defaultHttpRequest;
exports.putParameter = defaultPutParameter;
exports.getParameter = defaultGetParameter;
exports.deleteParameter = defaultDeleteParameter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQkFBMEI7QUFDMUIsNkNBQStCO0FBRS9CLDZEQUE2RDtBQUM3RCwwREFBMkU7QUFFM0UsNkRBQTZEO0FBQzdELG9EQUEwQztBQUUxQyw2REFBNkQ7QUFDN0Qsb0RBQTBDO0FBRTFDLE1BQU0seUJBQXlCLEdBQUcsTUFBTSxDQUFDLENBQUMsYUFBYTtBQUV2RCw0RUFBNEU7QUFDNUUsMERBQTBEO0FBQzFELDJGQUEyRjtBQUMzRixNQUFNLFlBQVksR0FBRztJQUNuQixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUU7Q0FDcEQsQ0FBQztBQUVGLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUE2QixFQUFFLFdBQW1CO0lBQ2xGLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDM0MsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDbEQsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsK0NBQStDO2dCQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUN2RCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsK0JBQStCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFFLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEdBQVEsQ0FBQztBQUNiLElBQUksTUFBYyxDQUFDO0FBQ25CLElBQUksR0FBUSxDQUFDO0FBRWIsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXdCO0lBQzNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULEdBQUcsR0FBRyxJQUFJLGdCQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELE9BQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEdBQXVCO0lBQzFELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNaLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQUksQ0FBQztRQUNIOzs7Ozs7Ozs7V0FTRztRQUNILE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFBQyxNQUFNLENBQUM7UUFDUDs7Ozs7V0FLRztRQUNILE1BQU0sSUFBQSx5Q0FBeUIsRUFBQztZQUM5QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRSxHQUFHO1NBQ2pCLEVBQUU7WUFDRCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxTQUFTO0lBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNULEdBQUcsR0FBRyxJQUFJLGdCQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxHQUE2QjtJQUM5RCxNQUFNLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsS0FBSyxVQUFVLG1CQUFtQixDQUFDLEdBQTZCO0lBQzlELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDL0IsQ0FBQztBQUVELEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxHQUFnQztJQUNwRSxNQUFNLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRVUsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxjQUFjLEdBQUcscUJBQXFCLENBQUM7QUFDdkMsUUFBQSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7QUFDakMsUUFBQSxZQUFZLEdBQUcsbUJBQW1CLENBQUM7QUFDbkMsUUFBQSxZQUFZLEdBQUcsbUJBQW1CLENBQUM7QUFDbkMsUUFBQSxlQUFlLEdBQUcsc0JBQXNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHR5cGUgeyBJbnZvY2F0aW9uUmVzcG9uc2UsIEludm9rZUNvbW1hbmRJbnB1dCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1sYW1iZGEnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgTGFtYmRhLCB3YWl0VW50aWxGdW5jdGlvbkFjdGl2ZVYyIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWxhbWJkYSc7XG5pbXBvcnQgdHlwZSB7IFN0YXJ0RXhlY3V0aW9uSW5wdXQsIFN0YXJ0RXhlY3V0aW9uT3V0cHV0IH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNmbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTRk4gfSBmcm9tICdAYXdzLXNkay9jbGllbnQtc2ZuJztcbmltcG9ydCB0eXBlIHsgRGVsZXRlUGFyYW1ldGVyQ29tbWFuZElucHV0LCBHZXRQYXJhbWV0ZXJDb21tYW5kSW5wdXQsIFB1dFBhcmFtZXRlckNvbW1hbmRJbnB1dCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zc20nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgU1NNIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNzbSc7XG5cbmNvbnN0IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgPSA5MDAwMDA7IC8vIDE1IG1pbnV0ZXNcblxuLy8gSW4gb3JkZXIgdG8gaG9ub3IgdGhlIG92ZXJhbGwgbWF4aW11bSB0aW1lb3V0IHNldCBmb3IgdGhlIHRhcmdldCBwcm9jZXNzLFxuLy8gdGhlIGRlZmF1bHQgMiBtaW51dGVzIGZyb20gQVdTIFNESyBoYXMgdG8gYmUgb3ZlcnJpZGVuOlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Db25maWcuaHRtbCNodHRwT3B0aW9ucy1wcm9wZXJ0eVxuY29uc3QgYXdzU2RrQ29uZmlnID0ge1xuICBodHRwT3B0aW9uczogeyB0aW1lb3V0OiBGUkFNRVdPUktfSEFORExFUl9USU1FT1VUIH0sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SHR0cFJlcXVlc3Qob3B0aW9uczogaHR0cHMuUmVxdWVzdE9wdGlvbnMsIHJlcXVlc3RCb2R5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJlc3BvbnNlLnJlc3VtZSgpOyAvLyBDb25zdW1lIHRoZSByZXNwb25zZSBidXQgZG9uJ3QgY2FyZSBhYm91dCBpdFxuICAgICAgICBpZiAoIXJlc3BvbnNlLnN0YXR1c0NvZGUgfHwgcmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZTogJHtyZXNwb25zZS5zdGF0dXNDb2RlfWApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgcmVxdWVzdC53cml0ZShyZXF1ZXN0Qm9keSk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgc2ZuOiBTRk47XG5sZXQgbGFtYmRhOiBMYW1iZGE7XG5sZXQgc3NtOiBTU007XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRTdGFydEV4ZWN1dGlvbihyZXE6IFN0YXJ0RXhlY3V0aW9uSW5wdXQpOiBQcm9taXNlPFN0YXJ0RXhlY3V0aW9uT3V0cHV0PiB7XG4gIGlmICghc2ZuKSB7XG4gICAgc2ZuID0gbmV3IFNGTihhd3NTZGtDb25maWcpO1xuICB9XG5cbiAgcmV0dXJuIHNmbi5zdGFydEV4ZWN1dGlvbihyZXEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SW52b2tlRnVuY3Rpb24ocmVxOiBJbnZva2VDb21tYW5kSW5wdXQpOiBQcm9taXNlPEludm9jYXRpb25SZXNwb25zZT4ge1xuICBpZiAoIWxhbWJkYSkge1xuICAgIGxhbWJkYSA9IG5ldyBMYW1iZGEoYXdzU2RrQ29uZmlnKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLyoqXG4gICAgICogVHJ5IGFuIGluaXRpYWwgaW52b2tlLlxuICAgICAqXG4gICAgICogV2hlbiB5b3UgdHJ5IHRvIGludm9rZSBhIGZ1bmN0aW9uIHRoYXQgaXMgaW5hY3RpdmUsIHRoZSBpbnZvY2F0aW9uIGZhaWxzIGFuZCBMYW1iZGEgc2V0c1xuICAgICAqIHRoZSBmdW5jdGlvbiB0byBwZW5kaW5nIHN0YXRlIHVudGlsIHRoZSBmdW5jdGlvbiByZXNvdXJjZXMgYXJlIHJlY3JlYXRlZC5cbiAgICAgKiBJZiBMYW1iZGEgZmFpbHMgdG8gcmVjcmVhdGUgdGhlIHJlc291cmNlcywgdGhlIGZ1bmN0aW9uIGlzIHNldCB0byB0aGUgaW5hY3RpdmUgc3RhdGUuXG4gICAgICpcbiAgICAgKiBXZSdyZSB1c2luZyBpbnZva2UgZmlyc3QgYmVjYXVzZSBgd2FpdEZvcmAgZG9lc24ndCB0cmlnZ2VyIGFuIGluYWN0aXZlIGZ1bmN0aW9uIHRvIGRvIGFueXRoaW5nLFxuICAgICAqIGl0IGp1c3QgcnVucyBgZ2V0RnVuY3Rpb25gIGFuZCBjaGVja3MgdGhlIHN0YXRlLlxuICAgICAqL1xuICAgIHJldHVybiBhd2FpdCBsYW1iZGEuaW52b2tlKHJlcSk7XG4gIH0gY2F0Y2gge1xuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0dXMgb2YgdGhlIExhbWJkYSBmdW5jdGlvbiBpcyBjaGVja2VkIGV2ZXJ5IHNlY29uZCBmb3IgdXAgdG8gMzAwIHNlY29uZHMuXG4gICAgICogRXhpdHMgdGhlIGxvb3Agb24gJ0FjdGl2ZScgc3RhdGUgYW5kIHRocm93cyBhbiBlcnJvciBvbiAnSW5hY3RpdmUnIG9yICdGYWlsZWQnLlxuICAgICAqXG4gICAgICogQW5kIG5vdyB3ZSB3YWl0LlxuICAgICAqL1xuICAgIGF3YWl0IHdhaXRVbnRpbEZ1bmN0aW9uQWN0aXZlVjIoe1xuICAgICAgY2xpZW50OiBsYW1iZGEsXG4gICAgICBtYXhXYWl0VGltZTogMzAwLFxuICAgIH0sIHtcbiAgICAgIEZ1bmN0aW9uTmFtZTogcmVxLkZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gbGFtYmRhLmludm9rZShyZXEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNzbUNsaWVudCgpOiBTU00ge1xuICBpZiAoIXNzbSkge1xuICAgIHNzbSA9IG5ldyBTU00oYXdzU2RrQ29uZmlnKTtcbiAgfVxuICByZXR1cm4gc3NtO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0UHV0UGFyYW1ldGVyKHJlcTogUHV0UGFyYW1ldGVyQ29tbWFuZElucHV0KTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IHNzbUNsaWVudCgpLnB1dFBhcmFtZXRlcihyZXEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0R2V0UGFyYW1ldGVyKHJlcTogR2V0UGFyYW1ldGVyQ29tbWFuZElucHV0KTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgcmVzcCA9IGF3YWl0IHNzbUNsaWVudCgpLmdldFBhcmFtZXRlcihyZXEpO1xuICByZXR1cm4gcmVzcC5QYXJhbWV0ZXI/LlZhbHVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0RGVsZXRlUGFyYW1ldGVyKHJlcTogRGVsZXRlUGFyYW1ldGVyQ29tbWFuZElucHV0KTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IHNzbUNsaWVudCgpLmRlbGV0ZVBhcmFtZXRlcihyZXEpO1xufVxuXG5leHBvcnQgbGV0IHN0YXJ0RXhlY3V0aW9uID0gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uO1xuZXhwb3J0IGxldCBpbnZva2VGdW5jdGlvbiA9IGRlZmF1bHRJbnZva2VGdW5jdGlvbjtcbmV4cG9ydCBsZXQgaHR0cFJlcXVlc3QgPSBkZWZhdWx0SHR0cFJlcXVlc3Q7XG5leHBvcnQgbGV0IHB1dFBhcmFtZXRlciA9IGRlZmF1bHRQdXRQYXJhbWV0ZXI7XG5leHBvcnQgbGV0IGdldFBhcmFtZXRlciA9IGRlZmF1bHRHZXRQYXJhbWV0ZXI7XG5leHBvcnQgbGV0IGRlbGV0ZVBhcmFtZXRlciA9IGRlZmF1bHREZWxldGVQYXJhbWV0ZXI7XG4iXX0=