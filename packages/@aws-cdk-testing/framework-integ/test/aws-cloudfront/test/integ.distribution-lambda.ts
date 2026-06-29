/**
 * This test uses Lambda@Edge which requires us-east-1.
 * Lambda@Edge replicas cannot be immediately deleted during stack teardown.
 * See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-delete-replicas.html
 */
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-distribution-lambda');

const edgeFunction = new lambda.Function(stack, 'Lambda', {
  code: lambda.Code.fromInline('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    edgeLambdas: [{
      functionVersion: edgeFunction.currentVersion,
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
    }],
  },
});

new IntegTest(app, 'integ-distribution-lambda-test', {
  testCases: [stack],
  regions: ['us-east-1'],
  cdkCommandOptions: {
    destroy: {
      // Lambda@Edge replicas cannot be immediately deleted; expect destroy to fail
      expectError: true,
    },
  },
});
