import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from '../../lib';

const app = new App();
const stack = new Stack(app, 'integ-lambda-add-subroute-integration');

const httpApi = new HttpApi(stack, 'test-apigwv2-add-subroute-integration');

const lambdaHandler = new lambda.Function(stack, 'AlwaysSuccess - FirstRoute', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: \'success - hit this lambda\' }; };'),
});

const secondLambdaHandler = new lambda.Function(stack, 'AlwaysSuccess - SecondRoute', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: \'success - hit this referneced lambda!\' }; };'),
});
const referencedLambdaFunction = lambda.Function.fromFunctionArn(stack, 'Referenced', secondLambdaHandler.functionArn);

const lambdaHandlerIntegration = new HttpLambdaIntegration('my-lambda-integration', lambdaHandler);
const referencedLambdaHandlerIntegration = new HttpLambdaIntegration('my-referenced-lambda-integration', referencedLambdaFunction);

// First Route tests regular Lambda Function Integration
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

// Second Route tests Referenced Lambda Function Integration
httpApi.addRoutes({
  path: '/secondroute',
  methods: [HttpMethod.GET],
  integration: referencedLambdaHandlerIntegration,
});

httpApi.addRoutes({
  path: '/secondroute/subroute',
  methods: [HttpMethod.GET],
  integration: referencedLambdaHandlerIntegration,
});

// Integ Test Assertions
const integ = new IntegTest(app, 'Integ', { testCases: [stack] });

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/firstroute').expect(ExpectedResult.objectLike({
  status: 200,
  body: 'success - hit this lambda',
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/firstroute/subroute').expect(ExpectedResult.objectLike({
  status: 200,
  body: 'success - hit this lambda',
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/secondroute').expect(ExpectedResult.objectLike({
  status: 200,
  body: 'success - hit this referenced lambda!',
}));

integ.assertions.httpApiCall(httpApi.apiEndpoint + '/secondroute/subroute').expect(ExpectedResult.objectLike({
  status: 200,
  body: 'success - hit this referenced lambda!',
}));