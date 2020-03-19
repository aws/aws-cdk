import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

const userpool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});