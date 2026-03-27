import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-cloudfront:defaultFunctionRuntimeV2_0': true,
  },
});
const stack = new cdk.Stack(app, 'integ-distribution-function-runtime');

const cfFunction = new cloudfront.Function(stack, 'Function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    functionAssociations: [{
      function: cfFunction,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }],
  },
});

const integ = new IntegTest(app, 'DistributionFunction', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudFront', 'describeFunction', {
  Name: cfFunction.functionName,
}).expect(
  ExpectedResult.objectLike({
    FunctionSummary: Match.objectLike({
      FunctionConfig: Match.objectLike({
        Runtime: 'cloudfront-js-2.0',
      }),
    }),
  }),
);
