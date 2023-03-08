import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { TestOrigin } from './test-origin';
import * as cloudfront from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-basic');

const distribution = new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

const role1 = new iam.Role(stack, 'Role1', {
  assumedBy: new iam.AccountRootPrincipal(),
});
const role2 = new iam.Role(stack, 'Role2', {
  assumedBy: new iam.AccountRootPrincipal(),
});
distribution.grantCreateInvalidation(role1);
distribution.grant(role2, 'cloudfront:ListInvalidations');

new IntegTest(stack, 'distribution-basic-test', {
  testCases: [stack],
});
