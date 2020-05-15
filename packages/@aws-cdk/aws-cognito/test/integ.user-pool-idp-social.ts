import { App, Stack } from '@aws-cdk/core';
import { SocialIdentityProvider, UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-social');

const userpool = new UserPool(stack, 'pool');

userpool.addIdentityProvider('userpoolidp', {
  userPoolIdentityProviderName: 'LoginWithAmazon',
  socialIdentity: SocialIdentityProvider.amazon({
    clientId: 'myclientid',
    clientSecret: 'myclientsecret',
  }),
});