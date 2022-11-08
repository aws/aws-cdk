import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-origin-id');

const origin = new TestOrigin('www.example.com', { originId: 'my-custom-origin-id' });

const distribution = new cloudfront.Distribution(stack, 'TestDistribution', {
  defaultBehavior: { origin },
});
distribution.addBehavior('/second', origin);
distribution.addBehavior('/third', origin);

new IntegTest(app, 'DistributionOriginId', {
  testCases: [stack],
});

app.synth();
