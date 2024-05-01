/// !cdk-integ *
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const region = 'eu-west-1';
const stack = new cdk.Stack(app, 'integ-distribution-lambda-cross-region', { env: { region: region } });

const lambdaFunction = new cloudfront.experimental.EdgeFunction(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const lambdaFunction2 = new cloudfront.experimental.EdgeFunction(stack, 'Lambda2', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  stackId: `edge-lambda-stack-${region}-2`,
});

lambdaFunction.addAlias('live');
lambdaFunction2.addAlias('live');

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [
      {
        functionVersion: lambdaFunction.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
      },
      {
        functionVersion: lambdaFunction2.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
      },
    ],
  },
});

new integ.IntegTest(app, 'cdk-integ-distribution-lambda-cross-region', {
  testCases: [stack],
  diffAssets: true,
});
