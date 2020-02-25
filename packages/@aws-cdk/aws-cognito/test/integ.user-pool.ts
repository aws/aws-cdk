import { App, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
});