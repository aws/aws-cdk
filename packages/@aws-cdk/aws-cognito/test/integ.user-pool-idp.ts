import { App, Stack } from '@aws-cdk/core';
import { OAuthScope, UserPool, UserPoolIdentityProvider } from '../lib';

/*
 * Stack verification steps - TBD
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp');

const userpool = new UserPool(stack, 'pool');

const provider = UserPoolIdentityProvider.amazon(stack, 'amazon', {
  userPool: userpool,
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
});

userpool.addClient('client', {
  oAuth: {
    flows: {
      implicitCodeGrant: true,
      authorizationCodeGrant: true,
    },
    scopes: [
      OAuthScope.EMAIL,
      OAuthScope.PHONE,
      OAuthScope.OPENID,
      OAuthScope.PROFILE,
      OAuthScope.COGNITO_ADMIN,
    ],
    callbackUrls: [
      'https://example.com',
    ],
  },
  identityProviders: [ provider ],
});

userpool.addDomain('domain', {
  cognitoDomain: {
    domainPrefix: 'nija-test-pool',
  },
});