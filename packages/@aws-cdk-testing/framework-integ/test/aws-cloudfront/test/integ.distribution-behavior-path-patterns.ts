import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-behavior-path-patterns');

// A distribution with several distinct behavior path patterns synthesizes
// and deploys cleanly. The duplicate-path-pattern check in
// Distribution.addBehavior only rejects a pattern that was already added,
// so valid usage like this is unaffected.
const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  additionalBehaviors: {
    '/images/*': { origin: new TestOrigin('images.example.com') },
  },
});
distribution.addBehavior('/api/*', new TestOrigin('api.example.com'));

new IntegTest(stack, 'distribution-behavior-path-patterns-test', {
  testCases: [stack],
});
