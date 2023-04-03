"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'TokenAuthorizerInteg');
const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.token-authorizer.handler')),
});
const authorizer = new lib_1.TokenAuthorizer(stack, 'MyAuthorizer', {
    handler: authorizerFn,
});
const restapi = new lib_1.RestApi(stack, 'MyRestApi', {
    cloudWatchRole: true,
    defaultMethodOptions: {
        authorizer,
    },
    defaultCorsPreflightOptions: {
        allowOrigins: lib_1.Cors.ALL_ORIGINS,
    },
});
restapi.root.addMethod('ANY', new lib_1.MockIntegration({
    integrationResponses: [
        { statusCode: '200' },
    ],
    passthroughBehavior: lib_1.PassthroughBehavior.NEVER,
    requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
    },
}), {
    methodResponses: [
        { statusCode: '200' },
    ],
});
const integ = new integ_tests_1.IntegTest(app, 'apigw-token-auth', {
    testCases: [stack],
});
const hostName = `${restapi.restApiId}.execute-api.${stack.region}.${stack.urlSuffix}`;
const testFunc = new lambda.Function(stack, 'InvokeFunction', {
    memorySize: 250,
    timeout: core_1.Duration.seconds(10),
    code: lambda.Code.fromInline(`
const https = require('https');
const options = {
  hostname: '${hostName}',
  path: '/${restapi.deploymentStage.stageName}',
};
exports.handler = async function(event) {
  console.log(event);
  options.method = event.method;
  if ('authorization' in event) {
    options.headers = {
      Authorization: event.authorization,
    };
  }
  let dataString = '';
  const response = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', data => {
        dataString += data;
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: dataString,
        });
      })
    });
    req.on('error', err => {
      reject({
        statusCode: 500,
        body: JSON.stringify({
          cause: 'Something went wrong',
          error: err,
        })
      });
    });
    req.end();
  });
  return response;
}
`),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_16_X,
});
const invokeGet = integ.assertions.invokeFunction({
    functionName: testFunc.functionName,
    payload: JSON.stringify({
        method: 'GET',
        authorization: 'allow',
    }),
});
invokeGet.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('200'),
}));
const invokeGetDeny = integ.assertions.invokeFunction({
    functionName: testFunc.functionName,
    payload: JSON.stringify({
        method: 'GET',
        authorization: 'deny',
    }),
});
invokeGetDeny.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('User is not authorized to access this resource with an explicit deny'),
}));
const invokeOptions = integ.assertions.invokeFunction({
    functionName: testFunc.functionName,
    payload: JSON.stringify({
        method: 'OPTIONS',
    }),
});
invokeOptions.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('204'),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudG9rZW4tYXV0aG9yaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnRva2VuLWF1dGhvcml6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLHdDQUFxRDtBQUNyRCxzREFBd0U7QUFDeEUsbUNBQWlHO0FBRWpHLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFFckQsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBRTtJQUN0RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0lBQ25DLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0NBQ3pGLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxHQUFHLElBQUkscUJBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQzVELE9BQU8sRUFBRSxZQUFZO0NBQ3RCLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxHQUFHLElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDOUMsY0FBYyxFQUFFLElBQUk7SUFDcEIsb0JBQW9CLEVBQUU7UUFDcEIsVUFBVTtLQUNYO0lBQ0QsMkJBQTJCLEVBQUU7UUFDM0IsWUFBWSxFQUFFLFVBQUksQ0FBQyxXQUFXO0tBQy9CO0NBQ0YsQ0FBQyxDQUFDO0FBR0gsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUkscUJBQWUsQ0FBQztJQUNoRCxvQkFBb0IsRUFBRTtRQUNwQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7S0FDdEI7SUFDRCxtQkFBbUIsRUFBRSx5QkFBbUIsQ0FBQyxLQUFLO0lBQzlDLGdCQUFnQixFQUFFO1FBQ2hCLGtCQUFrQixFQUFFLHVCQUF1QjtLQUM1QztDQUNGLENBQUMsRUFBRTtJQUNGLGVBQWUsRUFBRTtRQUNmLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtLQUN0QjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sS0FBSyxHQUFHLElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7SUFDbkQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILE1BQU0sUUFBUSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsZ0JBQWdCLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3ZGLE1BQU0sUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDNUQsVUFBVSxFQUFFLEdBQUc7SUFDZixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDN0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7ZUFHaEIsUUFBUTtZQUNYLE9BQU8sQ0FBQyxlQUFlLENBQUMsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBb0M1QyxDQUFDO0lBQ0EsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztDQUNwQyxDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUNoRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7SUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEIsTUFBTSxFQUFFLEtBQUs7UUFDYixhQUFhLEVBQUUsT0FBTztLQUN2QixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBQ0gsU0FBUyxDQUFDLE1BQU0sQ0FBQyw0QkFBYyxDQUFDLFVBQVUsQ0FBQztJQUN6QyxPQUFPLEVBQUUsbUJBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7Q0FDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUNwRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7SUFDbkMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEIsTUFBTSxFQUFFLEtBQUs7UUFDYixhQUFhLEVBQUUsTUFBTTtLQUN0QixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBQ0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyw0QkFBYyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxPQUFPLEVBQUUsbUJBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxzRUFBc0UsQ0FBQztDQUN4RyxDQUFDLENBQUMsQ0FBQztBQUVKLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQ3BELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtJQUNuQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBQ0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyw0QkFBYyxDQUFDLFVBQVUsQ0FBQztJQUM3QyxPQUFPLEVBQUUsbUJBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7Q0FDdkMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCwgRXhwZWN0ZWRSZXN1bHQsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgTW9ja0ludGVncmF0aW9uLCBQYXNzdGhyb3VnaEJlaGF2aW9yLCBSZXN0QXBpLCBUb2tlbkF1dGhvcml6ZXIsIENvcnMgfSBmcm9tICcuLi8uLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdUb2tlbkF1dGhvcml6ZXJJbnRlZycpO1xuXG5jb25zdCBhdXRob3JpemVyRm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlBdXRob3JpemVyRnVuY3Rpb24nLCB7XG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIGNvZGU6IGxhbWJkYS5Bc3NldENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdpbnRlZy50b2tlbi1hdXRob3JpemVyLmhhbmRsZXInKSksXG59KTtcblxuY29uc3QgYXV0aG9yaXplciA9IG5ldyBUb2tlbkF1dGhvcml6ZXIoc3RhY2ssICdNeUF1dGhvcml6ZXInLCB7XG4gIGhhbmRsZXI6IGF1dGhvcml6ZXJGbixcbn0pO1xuXG5jb25zdCByZXN0YXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdNeVJlc3RBcGknLCB7XG4gIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICBkZWZhdWx0TWV0aG9kT3B0aW9uczoge1xuICAgIGF1dGhvcml6ZXIsXG4gIH0sXG4gIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgIGFsbG93T3JpZ2luczogQ29ycy5BTExfT1JJR0lOUyxcbiAgfSxcbn0pO1xuXG5cbnJlc3RhcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xuICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgIHsgc3RhdHVzQ29kZTogJzIwMCcgfSxcbiAgXSxcbiAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgXCJzdGF0dXNDb2RlXCI6IDIwMCB9JyxcbiAgfSxcbn0pLCB7XG4gIG1ldGhvZFJlc3BvbnNlczogW1xuICAgIHsgc3RhdHVzQ29kZTogJzIwMCcgfSxcbiAgXSxcbn0pO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ3ctdG9rZW4tYXV0aCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5jb25zdCBob3N0TmFtZSA9IGAke3Jlc3RhcGkucmVzdEFwaUlkfS5leGVjdXRlLWFwaS4ke3N0YWNrLnJlZ2lvbn0uJHtzdGFjay51cmxTdWZmaXh9YDtcbmNvbnN0IHRlc3RGdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ludm9rZUZ1bmN0aW9uJywge1xuICBtZW1vcnlTaXplOiAyNTAsXG4gIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBcbmNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbmNvbnN0IG9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnJHtob3N0TmFtZX0nLFxuICBwYXRoOiAnLyR7cmVzdGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lfScsXG59O1xuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgZnVuY3Rpb24oZXZlbnQpIHtcbiAgY29uc29sZS5sb2coZXZlbnQpO1xuICBvcHRpb25zLm1ldGhvZCA9IGV2ZW50Lm1ldGhvZDtcbiAgaWYgKCdhdXRob3JpemF0aW9uJyBpbiBldmVudCkge1xuICAgIG9wdGlvbnMuaGVhZGVycyA9IHtcbiAgICAgIEF1dGhvcml6YXRpb246IGV2ZW50LmF1dGhvcml6YXRpb24sXG4gICAgfTtcbiAgfVxuICBsZXQgZGF0YVN0cmluZyA9ICcnO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCByZXEgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgIHJlcy5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICBkYXRhU3RyaW5nICs9IGRhdGE7XG4gICAgICB9KVxuICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN0YXR1c0NvZGU6IHJlcy5zdGF0dXNDb2RlLFxuICAgICAgICAgIGJvZHk6IGRhdGFTdHJpbmcsXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICByZXEub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgIHJlamVjdCh7XG4gICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNhdXNlOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcnLFxuICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXEuZW5kKCk7XG4gIH0pO1xuICByZXR1cm4gcmVzcG9uc2U7XG59XG5gKSxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTZfWCxcbn0pO1xuXG5jb25zdCBpbnZva2VHZXQgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiB0ZXN0RnVuYy5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGF1dGhvcml6YXRpb246ICdhbGxvdycsXG4gIH0pLFxufSk7XG5pbnZva2VHZXQuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDAnKSxcbn0pKTtcblxuY29uc3QgaW52b2tlR2V0RGVueSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IHRlc3RGdW5jLmZ1bmN0aW9uTmFtZSxcbiAgcGF5bG9hZDogSlNPTi5zdHJpbmdpZnkoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgYXV0aG9yaXphdGlvbjogJ2RlbnknLFxuICB9KSxcbn0pO1xuaW52b2tlR2V0RGVueS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ1VzZXIgaXMgbm90IGF1dGhvcml6ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2Ugd2l0aCBhbiBleHBsaWNpdCBkZW55JyksXG59KSk7XG5cbmNvbnN0IGludm9rZU9wdGlvbnMgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiB0ZXN0RnVuYy5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBtZXRob2Q6ICdPUFRJT05TJyxcbiAgfSksXG59KTtcbmludm9rZU9wdGlvbnMuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDQnKSxcbn0pKTtcbiJdfQ==