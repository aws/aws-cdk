import * as path from 'path';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '../../lib';

/*
 * Stack verification steps:
 * * `curl -H 'X-API-Key: 123' <url>` should return 200
 * * `curl <url>` should return 401
 * * `curl -H 'X-API-Key: 1234' <url>` should return 403
 */

const app = new App();
const stack = new Stack(app, 'AuthorizerInteg');

const httpApi = new HttpApi(stack, 'MyHttpApi');

const authHandler = new lambda.Function(stack, 'auth-function', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, '../auth-handler')),
});


const authorizer = new HttpLambdaAuthorizer('LambdaAuthorizer', authHandler, {
  authorizerName: 'my-simple-authorizer',
  identitySource: ['$request.header.X-API-Key'],
  responseTypes: [HttpLambdaResponseType.SIMPLE],
});

const handler = new lambda.Function(stack, 'lambda', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, '../integ.lambda.handler')),
});

httpApi.addRoutes({
  path: '/',
  methods: [HttpMethod.GET],
  integration: new HttpLambdaIntegration('RootIntegration', handler),
  authorizer,
});

new CfnOutput(stack, 'URL', {
  value: httpApi.url!,
});
