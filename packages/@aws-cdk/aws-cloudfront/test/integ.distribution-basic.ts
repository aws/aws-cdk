import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as cloudfront from '../lib';
import { TestOrigin } from './test-origin';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-basic');

const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.AccountRootPrincipal(),
});
distribution.grantCreateInvalidation(role);

new IntegTest(stack, 'distribution-basic-test', {
  testCases: [stack],
});
