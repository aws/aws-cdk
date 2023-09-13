import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpUrlIntegration, HttpLambdaIntegration } from '../../lib';

/*
 * Stack verification steps:
 * "curl <endpoint-in-the-stack-output>" should return 'success'
 */

const app = new App();

const stack = new Stack(app, 'integ-http-proxy');

// first create a lambda proxy endpoint that we can use as an HTTP proxy
const lambdaEndpoint = lambdaProxyEndpoint(stack);

const httpEndpoint = new HttpApi(stack, 'HttpProxyApi', {
  defaultIntegration: new HttpUrlIntegration('DefaultIntegration', lambdaEndpoint.url!),
});

new CfnOutput(stack, 'Endpoint', {
  value: httpEndpoint.url!,
});

function lambdaProxyEndpoint(s: Stack): HttpApi {
  const handler = new lambda.Function(s, 'AlwaysSuccess', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "success" }; };'),
  });

  return new HttpApi(s, 'LambdaProxyApi', {
    defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', handler),
  });
}