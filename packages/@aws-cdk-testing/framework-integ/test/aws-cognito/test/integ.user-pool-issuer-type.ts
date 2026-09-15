import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { UserPool, UserPoolIssuerType } from 'aws-cdk-lib/aws-cognito';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-issuer-type');

new UserPool(stack, 'UserPoolOriginal', {
  userPoolName: 'IssuerTypeOriginal',
  issuerType: UserPoolIssuerType.ORIGINAL,
  removalPolicy: RemovalPolicy.DESTROY,
  deletionProtection: false,
});

new UserPool(stack, 'UserPoolUpdated', {
  userPoolName: 'IssuerTypeUpdated',
  issuerType: UserPoolIssuerType.UPDATED,
  removalPolicy: RemovalPolicy.DESTROY,
  deletionProtection: false,
});

new integ.IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
