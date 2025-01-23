import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-domain-managed-login');

const userpool = new cognito.UserPool(stack, 'UserPool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const domain = userpool.addDomain('Domain', {
  cognitoDomain: {
    domainPrefix: 'naonao-user-pool-domain',
  },
  managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
});

new CfnOutput(stack, 'Domain', {
  value: domain.domainName,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });
