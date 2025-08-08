import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-mt-distribution-http-version');

new cloudfront.MTDistribution(stack, 'Http11', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP1_1,
});
new cloudfront.MTDistribution(stack, 'Http2', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP2,
});
new cloudfront.MTDistribution(stack, 'Http2and3', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
});
new cloudfront.MTDistribution(stack, 'Http3', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP3,
});

new IntegTest(app, 'MTDistributionHttpVersion', {
  testCases: [stack],
});
