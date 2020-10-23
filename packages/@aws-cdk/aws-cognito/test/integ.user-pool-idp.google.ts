import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderGoogle } from '../lib';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'Google' sign in link shows up.
 * * If you plug in valid 'Google' credentials, the federated log in should work.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-google');

const userpool = new UserPool(stack, 'pool');

new UserPoolIdentityProviderGoogle(stack, 'google', {
  userPool: userpool,
  clientId: 'google-client-id',
  clientSecret: 'google-client-secret',
  attributeMapping: {
    givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
    familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
    email: ProviderAttribute.GOOGLE_EMAIL,
    gender: ProviderAttribute.GOOGLE_GENDER,
    custom: {
      names: ProviderAttribute.GOOGLE_NAMES,
    },
  },
});

const client = userpool.addClient('client');

const domain = userpool.addDomain('domain', {
  cognitoDomain: {
    domainPrefix: 'nija-test-pool',
  },
});

new CfnOutput(stack, 'SignInLink', {
  value: domain.signInUrl(client, {
    redirectUri: 'https://example.com',
  }),
});