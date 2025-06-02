import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'stack-cors-allow-multiple-origins');

const api = new apigw.RestApi(stack, 'cors-api-test', {
  defaultCorsPreflightOptions: {
    allowOrigins: ['https://amazon.com', 'https://twitch.tv', 'https://aws.amazon.com'],
  },
});

const handler = new lambda.Function(stack, 'handler', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler'), { exclude: ['*.ts'] }),
});

const lambdaInteg = new apigw.LambdaIntegration(handler);

const resource = api.root.addResource('my-resource');
resource.addMethod('GET', lambdaInteg);

new IntegTest(app, 'integ-cors-allow-multiple-origins', {
  testCases: [stack],
});

app.synth();
