import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-tenant-mode-basic');

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  connectionMode: cloudfront.ConnectionMode.TENANT_ONLY,
});

new IntegTest(app, 'distribution-tenant-mode-basic-test', {
  testCases: [stack],
});
