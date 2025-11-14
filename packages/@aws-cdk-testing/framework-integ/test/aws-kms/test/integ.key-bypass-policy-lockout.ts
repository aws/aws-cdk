import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-bypass-policy-lockout');

new Key(stack, 'KeyWithBypassTrue', {
  bypassPolicyLockoutSafetyCheck: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

new Key(stack, 'KeyWithBypassFalse', {
  bypassPolicyLockoutSafetyCheck: false,
  removalPolicy: RemovalPolicy.DESTROY,
});

new Key(stack, 'KeyWithBypassUndefined', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'BypassPolicyLockoutIntegTest', {
  testCases: [stack],
});
