import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { LambdaProxyIntegration } from '../../lib';

/*
 * Stack verification steps:
 * "curl <endpoint-in-the-stack-output>" should return 'success'
 */

const app = new App();

const stack = new Stack(app, 'integ-lambda-proxy');

const handler = new lambda.Function(stack, 'AlwaysSuccess', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "success" }; };'),
});

const endpoint = new HttpApi(stack, 'LambdaProxyApi', {
  defaultIntegration: new LambdaProxyIntegration({
    handler,
  }),
});

new CfnOutput(stack, 'Endpoint', {
  value: endpoint.url!,
});