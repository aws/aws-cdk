import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-lambda-permission-consolidation');

const httpApi = new HttpApi(stack, 'HttpApi');

const lambdaHandler = new lambda.Function(stack, 'Handler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: JSON.stringify({ message: \'Hello from \' + event.requestContext.http.path }) }; };'),
});

// Add 11 routes to trigger permission consolidation
for (let i = 1; i <= 11; i++) {
  new HttpRoute(stack, `Route${i}`, {
    httpApi: httpApi,
    integration: new HttpLambdaIntegration(`Integration${i}`, lambdaHandler),
    routeKey: HttpRouteKey.with(`/path${i}`, HttpMethod.GET),
  });
}

// Add another route after consolidation to verify it still works
new HttpRoute(stack, 'Route12', {
  httpApi: httpApi,
  integration: new HttpLambdaIntegration('Integration12', lambdaHandler),
  routeKey: HttpRouteKey.with('/path12', HttpMethod.GET),
});

// Integ Test Assertions
const integ = new IntegTest(app, 'Integ', { testCases: [stack] });

// Test that routes work after consolidation
integ.assertions.httpApiCall(httpApi.apiEndpoint + '/path1').expect(ExpectedResult.objectLike({
  body: { message: 'Hello from /path1' },
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/path12').expect(ExpectedResult.objectLike({
  body: { message: 'Hello from /path12' },
  status: 200,
}));
