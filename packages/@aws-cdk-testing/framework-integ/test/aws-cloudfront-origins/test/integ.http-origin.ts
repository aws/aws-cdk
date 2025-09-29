import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cloudfront-http-origin');

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com', { ipAddressType: cloudfront.OriginIpAddressType.DUALSTACK }) },
});

new IntegTest(app, 'http-origin-test-integ', {
  testCases: [stack],
});
