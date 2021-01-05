/// !cdk-integ *
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();

const region = 'eu-west-1';
const stack = new cdk.Stack(app, 'integ-distribution-lambda-cross-region', { env: { region: region } });

const lambdaFunction = new cloudfront.experimental.EdgeFunction(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const lambdaFunction2 = new cloudfront.experimental.EdgeFunction(stack, 'Lambda2', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
  stackId: `edge-lambda-stack-${region}-2`,
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

new cloudfront.Distribution(stack, 'Dist2', {
  defaultBehavior: {
    origin: new TestOrigin('www.example2.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: lambdaFunction2.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
    }],
  },
});

app.synth();
