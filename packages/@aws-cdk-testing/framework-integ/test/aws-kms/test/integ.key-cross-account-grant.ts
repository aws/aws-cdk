import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';

/**
 * To run this test, bootstrap two accounts in the same region and configure the cross-account
 * bootstrap roles to trust the profile passed to the integ runner. Set CDK_INTEG_ACCOUNT to the
 * resource account and CDK_INTEG_CROSS_ACCOUNT to the principal account. For a live toolkit-lib
 * run, pass both variables through --app so snapshot synthesis uses the real accounts.
 */
const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-iam:crossAccountGrantsViaPrincipalTag': true,
  },
});

const resourceStack = new Stack(app, 'KeyResourceStack', {
  env: { account },
});
const key = new kms.Key(resourceStack, 'Key', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const principalStack = new Stack(app, 'KeyPrincipalStack', {
  env: { account: crossAccount },
});
const role = new iam.Role(principalStack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

key.grantDecrypt(role);

new integ.IntegTest(app, 'KeyCrossAccountGrant', {
  testCases: [resourceStack, principalStack],
});
