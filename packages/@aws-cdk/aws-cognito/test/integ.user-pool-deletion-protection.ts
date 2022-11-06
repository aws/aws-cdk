import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

new UserPool(stack, 'myuserpool', {
  isDeletionProtection: true,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'aws-cdk-config-custompolicy-integ', {
  testCases: [stack],
});
app.synth();