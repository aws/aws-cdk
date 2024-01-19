import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-additional-metrics');

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  publishAdditionalMetrics: true,
});

new IntegTest(stack, 'distribution-additional-metrics-test', {
  testCases: [stack],
});
