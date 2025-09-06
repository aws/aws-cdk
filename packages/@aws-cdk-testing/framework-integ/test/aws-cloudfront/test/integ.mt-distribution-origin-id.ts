import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-mt-distribution-origin-id');

const origin = new TestOrigin('www.example.com', { originId: 'my-custom-origin-id' });

const distribution = new cloudfront.MTDistribution(stack, 'TestDistribution', {
  defaultBehavior: { origin },
});
distribution.addBehavior('/second', origin);
distribution.addBehavior('/third', origin);

new IntegTest(app, 'MTDistributionOriginId', {
  testCases: [stack],
});

app.synth();
