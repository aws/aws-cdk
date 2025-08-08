import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

/*
 * Stack verification steps:
 * "curl <endpoint-in-the-stack-output>" should return 'success'
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'integ-lambda-proxy');

const handler = new lambda.Function(stack, 'AlwaysSuccess', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, body: "success" }; };'),
});

const endpoint = new HttpApi(stack, 'LambdaProxyApi', {
  defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', handler),
});

new CfnOutput(stack, 'Endpoint', {
  value: endpoint.url!,
});
