import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-response-completion-timeout');

const httpOrigin = new origins.HttpOrigin('example.com', {
  responseCompletionTimeout: cdk.Duration.seconds(120),
  readTimeout: cdk.Duration.seconds(60),
});

const fn = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello from Lambda!" });'),
});

const fnUrl = fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});

const functionUrlOrigin = new origins.FunctionUrlOrigin(fnUrl, {
  responseCompletionTimeout: cdk.Duration.seconds(90),
  readTimeout: cdk.Duration.seconds(30),
});

const httpOriginNoReadTimeout = new origins.HttpOrigin('api.example.com', {
  responseCompletionTimeout: cdk.Duration.seconds(300),
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: httpOrigin,
  },
  additionalBehaviors: {
    '/api/*': {
      origin: functionUrlOrigin,
    },
    '/files/*': {
      origin: httpOriginNoReadTimeout,
    },
  },
});

new IntegTest(app, 'CloudFrontResponseCompletionTimeoutTest', {
  testCases: [stack],
});
