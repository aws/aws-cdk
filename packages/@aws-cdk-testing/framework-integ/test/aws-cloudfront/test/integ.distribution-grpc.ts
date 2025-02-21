import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-grpc');

const origin = new TestOrigin('www.example.com');

const distribution = new cloudfront.Distribution(stack, 'TestDistribution', {
  defaultBehavior: {
    origin,
    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    enableGrpc: true,
  },
});
distribution.addBehavior('/second', origin);
distribution.addBehavior('/third', origin);

new IntegTest(app, 'DistributionGrpc', {
  testCases: [stack],
});
