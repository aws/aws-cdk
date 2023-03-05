import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { TestOrigin } from './test-origin';
import * as cloudfront from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-http-version');

new cloudfront.Distribution(stack, 'Http11', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP1_1,
});
new cloudfront.Distribution(stack, 'Http2', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP2,
});
new cloudfront.Distribution(stack, 'Http2and3', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
});
new cloudfront.Distribution(stack, 'Http3', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  httpVersion: cloudfront.HttpVersion.HTTP3,
});

new IntegTest(app, 'DistributionHttpVersion', {
  testCases: [stack],
});

app.synth();
