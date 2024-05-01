import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

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
