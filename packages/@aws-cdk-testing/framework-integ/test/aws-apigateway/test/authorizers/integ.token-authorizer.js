"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'TokenAuthorizerInteg');
const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.token-authorizer.handler')),
});
const authorizer = new aws_apigateway_1.TokenAuthorizer(stack, 'MyAuthorizer', {
    handler: authorizerFn,
});
const restapi = new aws_apigateway_1.RestApi(stack, 'MyRestApi', {
    cloudWatchRole: true,
    defaultMethodOptions: {
        authorizer,
    },
    defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway_1.Cors.ALL_ORIGINS,
    },
});
restapi.root.addMethod('ANY', new aws_apigateway_1.MockIntegration({
    integrationResponses: [
        { statusCode: '200' },
    ],
    passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
    requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
    },
}), {
    methodResponses: [
        { statusCode: '200' },
    ],
});
const integ = new integ_tests_alpha_1.IntegTest(app, 'apigw-token-auth', {
    testCases: [stack],
});
const hostName = `${restapi.restApiId}.execute-api.${stack.region}.${stack.urlSuffix}`;
const testFunc = new lambda.Function(stack, 'InvokeFunction', {
    memorySize: 250,
    timeout: aws_cdk_lib_1.Duration.seconds(10),
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
invokeGet.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('200'),
}));
const invokeGetDeny = integ.assertions.invokeFunction({
    functionName: testFunc.functionName,
    payload: JSON.stringify({
        method: 'GET',
        authorization: 'deny',
    }),
});
invokeGetDeny.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('User is not authorized to access this resource with an explicit deny'),
}));
const invokeOptions = integ.assertions.invokeFunction({
    functionName: testFunc.functionName,
    payload: JSON.stringify({
        method: 'OPTIONS',
    }),
});
invokeOptions.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('204'),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudG9rZW4tYXV0aG9yaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnRva2VuLWF1dGhvcml6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsaURBQWlEO0FBQ2pELDZDQUFtRDtBQUNuRCxrRUFBOEU7QUFDOUUsK0RBQWtIO0FBRWxILE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUVyRCxNQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO0lBQ3RFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDbkMsT0FBTyxFQUFFLGVBQWU7SUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7Q0FDekYsQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxnQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDNUQsT0FBTyxFQUFFLFlBQVk7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSx3QkFBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDOUMsY0FBYyxFQUFFLElBQUk7SUFDcEIsb0JBQW9CLEVBQUU7UUFDcEIsVUFBVTtLQUNYO0lBQ0QsMkJBQTJCLEVBQUU7UUFDM0IsWUFBWSxFQUFFLHFCQUFJLENBQUMsV0FBVztLQUMvQjtDQUNGLENBQUMsQ0FBQztBQUdILE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLGdDQUFlLENBQUM7SUFDaEQsb0JBQW9CLEVBQUU7UUFDcEIsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO0tBQ3RCO0lBQ0QsbUJBQW1CLEVBQUUsb0NBQW1CLENBQUMsS0FBSztJQUM5QyxnQkFBZ0IsRUFBRTtRQUNoQixrQkFBa0IsRUFBRSx1QkFBdUI7S0FDNUM7Q0FDRixDQUFDLEVBQUU7SUFDRixlQUFlLEVBQUU7UUFDZixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7S0FDdEI7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFO0lBQ25ELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFDSCxNQUFNLFFBQVEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLGdCQUFnQixLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN2RixNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzVELFVBQVUsRUFBRSxHQUFHO0lBQ2YsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM3QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7OztlQUdoQixRQUFRO1lBQ1gsT0FBTyxDQUFDLGVBQWUsQ0FBQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQzVDLENBQUM7SUFDQSxPQUFPLEVBQUUsZUFBZTtJQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0NBQ3BDLENBQUMsQ0FBQztBQUVILE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQ2hELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtJQUNuQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QixNQUFNLEVBQUUsS0FBSztRQUNiLGFBQWEsRUFBRSxPQUFPO0tBQ3ZCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxTQUFTLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO0lBQ3pDLE9BQU8sRUFBRSx5QkFBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQztDQUN2QyxDQUFDLENBQUMsQ0FBQztBQUVKLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQ3BELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtJQUNuQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QixNQUFNLEVBQUUsS0FBSztRQUNiLGFBQWEsRUFBRSxNQUFNO0tBQ3RCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxhQUFhLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO0lBQzdDLE9BQU8sRUFBRSx5QkFBSyxDQUFDLGdCQUFnQixDQUFDLHNFQUFzRSxDQUFDO0NBQ3hHLENBQUMsQ0FBQyxDQUFDO0FBRUosTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDcEQsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0lBQ25DLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxhQUFhLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO0lBQzdDLE9BQU8sRUFBRSx5QkFBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQztDQUN2QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCwgRXhwZWN0ZWRSZXN1bHQsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgTW9ja0ludGVncmF0aW9uLCBQYXNzdGhyb3VnaEJlaGF2aW9yLCBSZXN0QXBpLCBUb2tlbkF1dGhvcml6ZXIsIENvcnMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1Rva2VuQXV0aG9yaXplckludGVnJyk7XG5cbmNvbnN0IGF1dGhvcml6ZXJGbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdNeUF1dGhvcml6ZXJGdW5jdGlvbicsIHtcbiAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgY29kZTogbGFtYmRhLkFzc2V0Q29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2ludGVnLnRva2VuLWF1dGhvcml6ZXIuaGFuZGxlcicpKSxcbn0pO1xuXG5jb25zdCBhdXRob3JpemVyID0gbmV3IFRva2VuQXV0aG9yaXplcihzdGFjaywgJ015QXV0aG9yaXplcicsIHtcbiAgaGFuZGxlcjogYXV0aG9yaXplckZuLFxufSk7XG5cbmNvbnN0IHJlc3RhcGkgPSBuZXcgUmVzdEFwaShzdGFjaywgJ015UmVzdEFwaScsIHtcbiAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gIGRlZmF1bHRNZXRob2RPcHRpb25zOiB7XG4gICAgYXV0aG9yaXplcixcbiAgfSxcbiAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgYWxsb3dPcmlnaW5zOiBDb3JzLkFMTF9PUklHSU5TLFxuICB9LFxufSk7XG5cblxucmVzdGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XG4gIGludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgeyBzdGF0dXNDb2RlOiAnMjAwJyB9LFxuICBdLFxuICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBQYXNzdGhyb3VnaEJlaGF2aW9yLk5FVkVSLFxuICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBcInN0YXR1c0NvZGVcIjogMjAwIH0nLFxuICB9LFxufSksIHtcbiAgbWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgeyBzdGF0dXNDb2RlOiAnMjAwJyB9LFxuICBdLFxufSk7XG5cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsICdhcGlndy10b2tlbi1hdXRoJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcbmNvbnN0IGhvc3ROYW1lID0gYCR7cmVzdGFwaS5yZXN0QXBpSWR9LmV4ZWN1dGUtYXBpLiR7c3RhY2sucmVnaW9ufS4ke3N0YWNrLnVybFN1ZmZpeH1gO1xuY29uc3QgdGVzdEZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnSW52b2tlRnVuY3Rpb24nLCB7XG4gIG1lbW9yeVNpemU6IDI1MCxcbiAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxMCksXG4gIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYFxuY29uc3QgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpO1xuY29uc3Qgb3B0aW9ucyA9IHtcbiAgaG9zdG5hbWU6ICcke2hvc3ROYW1lfScsXG4gIHBhdGg6ICcvJHtyZXN0YXBpLmRlcGxveW1lbnRTdGFnZS5zdGFnZU5hbWV9Jyxcbn07XG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZyhldmVudCk7XG4gIG9wdGlvbnMubWV0aG9kID0gZXZlbnQubWV0aG9kO1xuICBpZiAoJ2F1dGhvcml6YXRpb24nIGluIGV2ZW50KSB7XG4gICAgb3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgQXV0aG9yaXphdGlvbjogZXZlbnQuYXV0aG9yaXphdGlvbixcbiAgICB9O1xuICB9XG4gIGxldCBkYXRhU3RyaW5nID0gJyc7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlcSA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgcmVzLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIGRhdGFTdHJpbmcgKz0gZGF0YTtcbiAgICAgIH0pXG4gICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3RhdHVzQ29kZTogcmVzLnN0YXR1c0NvZGUsXG4gICAgICAgICAgYm9keTogZGF0YVN0cmluZyxcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0pO1xuICAgIHJlcS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY2F1c2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJlcS5lbmQoKTtcbiAgfSk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cbmApLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNl9YLFxufSk7XG5cbmNvbnN0IGludm9rZUdldCA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IHRlc3RGdW5jLmZ1bmN0aW9uTmFtZSxcbiAgcGF5bG9hZDogSlNPTi5zdHJpbmdpZnkoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgYXV0aG9yaXphdGlvbjogJ2FsbG93JyxcbiAgfSksXG59KTtcbmludm9rZUdldC5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJzIwMCcpLFxufSkpO1xuXG5jb25zdCBpbnZva2VHZXREZW55ID0gaW50ZWcuYXNzZXJ0aW9ucy5pbnZva2VGdW5jdGlvbih7XG4gIGZ1bmN0aW9uTmFtZTogdGVzdEZ1bmMuZnVuY3Rpb25OYW1lLFxuICBwYXlsb2FkOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBhdXRob3JpemF0aW9uOiAnZGVueScsXG4gIH0pLFxufSk7XG5pbnZva2VHZXREZW55LmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgUGF5bG9hZDogTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnVXNlciBpcyBub3QgYXV0aG9yaXplZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZSB3aXRoIGFuIGV4cGxpY2l0IGRlbnknKSxcbn0pKTtcblxuY29uc3QgaW52b2tlT3B0aW9ucyA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IHRlc3RGdW5jLmZ1bmN0aW9uTmFtZSxcbiAgcGF5bG9hZDogSlNPTi5zdHJpbmdpZnkoe1xuICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICB9KSxcbn0pO1xuaW52b2tlT3B0aW9ucy5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJzIwNCcpLFxufSkpO1xuIl19