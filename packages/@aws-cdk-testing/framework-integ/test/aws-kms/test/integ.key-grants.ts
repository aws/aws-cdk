import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-grants');

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

const key = new Key(stack, 'MyKey', { removalPolicy: RemovalPolicy.DESTROY });

key.grantSignVerify(role);

new IntegTest(app, 'KeyGrantsIntegTest', {
  testCases: [
    stack,
  ],
});
