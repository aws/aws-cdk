import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { TestOrigin } from './test-origin';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'mt-distribution-geo-restrictions');

new cloudfront.MTDistribution(stack, 'MyDistribution', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
  },
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});

new IntegTest(app, 'integ-mt-distribution-geo-restrictions-test', {
  testCases: [stack],
});

