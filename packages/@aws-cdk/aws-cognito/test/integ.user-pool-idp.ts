import { App, Stack } from '@aws-cdk/core';
import { UserPool, UserPoolIdentityProvider } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp');

const userpool = new UserPool(stack, 'pool');

UserPoolIdentityProvider.amazon(stack, 'amazon', {
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
  userPool: userpool,
});

UserPoolIdentityProvider.facebook(stack, 'facebook', {
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
  userPool: userpool,
});