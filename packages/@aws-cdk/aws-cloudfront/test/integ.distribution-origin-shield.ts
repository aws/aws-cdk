import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-origin-shield');

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com', {
      originShieldEnabled: false,
    }),
  },
});

new IntegTest(app, 'DistributionOriginShield', {
  testCases: [stack],
});

app.synth();