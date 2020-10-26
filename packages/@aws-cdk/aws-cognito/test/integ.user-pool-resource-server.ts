import { App, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-resource-server');

const userPool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
});

userPool.addResourceServer('myserver', {
  identifier: 'users',
  userPoolResourceServerName: 'internal-users',
  scopes: [
    {
      scopeName: 'read',
      scopeDescription: 'read only',
    },
  ],
});
