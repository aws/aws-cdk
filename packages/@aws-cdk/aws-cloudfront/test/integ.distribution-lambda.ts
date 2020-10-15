import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-lambda', { env: { region: 'us-east-1' } });

const lambdaFunction = new lambda.Function(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: lambdaFunction.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
    }],
  },
});

app.synth();
