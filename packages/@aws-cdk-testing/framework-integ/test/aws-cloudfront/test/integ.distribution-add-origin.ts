import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-add-origin');

const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

// Add an additional origin without a behavior
distribution.addOrigin(new TestOrigin('api.example.com'));

new IntegTest(stack, 'distribution-add-origin-test', {
  testCases: [stack],
});
