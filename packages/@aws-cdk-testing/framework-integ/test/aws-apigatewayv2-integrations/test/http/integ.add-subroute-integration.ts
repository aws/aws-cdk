import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-lambda-add-subroute-integration');

const httpApi = new HttpApi(stack, 'test-apigwv2-add-subroute-integration');

// Regular Lambda Function
const lambdaHandler = new lambda.Function(stack, 'first-lambda-function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: \'success-hit-first-lambda\' }; };'),
});
const lambdaHandlerIntegration = new HttpLambdaIntegration('my-lambda-integration', lambdaHandler);

// Lambda created with Function.fromFunctionAttributes()
const secondLambdaHandler = new lambda.Function(stack, 'second-lambda-function', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: \'success-hit-second-lambda\' }; };'),
});
const lambdaFromFunctionAttributes = lambda.Function.fromFunctionAttributes(stack, 'Referenced-Lambda-Attributes', {
  functionArn: secondLambdaHandler.functionArn,
  sameEnvironment: true,
});
const lambdaFromFunctionAttributesIntegration = new HttpLambdaIntegration('my-referenced-lambda-integration', lambdaFromFunctionAttributes);

// Lambda created with Function.fromFunctionName()
const thirdLambdaName = 'third-lambda-function';
new lambda.Function(stack, thirdLambdaName, {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: \'success-hit-third-lambda\' }; };'),
  functionName: thirdLambdaName,
});
const lambdaFromFunctionName = lambda.Function.fromFunctionName(stack, 'Referenced-Lambda-Name', thirdLambdaName);
const lambdaFromFunctionNameIntegration = new HttpLambdaIntegration('my-referenced-lambda-integration', lambdaFromFunctionName);

// First Route tests Integration with regular Lambda Function
httpApi.addRoutes({
  path: '/firstroute',
  methods: [HttpMethod.GET],
  integration: lambdaHandlerIntegration,
});

httpApi.addRoutes({
  path: '/firstroute/subroute',
  methods: [HttpMethod.GET],
  integration: lambdaHandlerIntegration,
});

// Second Route tests Integration with Lambda.Function.fromFunctionAttributes()
httpApi.addRoutes({
  path: '/secondroute',
  methods: [HttpMethod.GET],
  integration: lambdaFromFunctionAttributesIntegration,
});

httpApi.addRoutes({
  path: '/secondroute/subroute',
  methods: [HttpMethod.GET],
  integration: lambdaFromFunctionAttributesIntegration,
});

// Third Route tests Integration with Lambda.Function.fromFunctionName()
httpApi.addRoutes({
  path: '/thirdroute',
  methods: [HttpMethod.GET],
  integration: lambdaFromFunctionNameIntegration,
});

httpApi.addRoutes({
  path: '/thirdroute/subroute',
  methods: [HttpMethod.GET],
  integration: lambdaFromFunctionNameIntegration,
});

// Integ Test Assertions
const integ = new IntegTest(app, 'Integ', { testCases: [stack] });

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/firstroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-first-lambda',
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/firstroute/subroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-first-lambda',
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/secondroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-second-lambda',
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/secondroute/subroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-second-lambda',
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/thirdroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-third-lambda',
  status: 200,
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/thirdroute/subroute').expect(ExpectedResult.objectLike({
  body: 'success-hit-third-lambda',
  status: 200,
}));
