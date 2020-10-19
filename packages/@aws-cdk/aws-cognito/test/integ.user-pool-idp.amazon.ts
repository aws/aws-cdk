import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderAmazon } from '../lib';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'Login with Amazon' link shows up.
 * * If you plug in valid 'Login with Amazon' credentials, the federated log in should work.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-amazon');

const userpool = new UserPool(stack, 'pool');

new UserPoolIdentityProviderAmazon(stack, 'amazon', {
  userPool: userpool,
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
  attributeMapping: {
    givenName: ProviderAttribute.AMAZON_NAME,
    email: ProviderAttribute.AMAZON_EMAIL,
    custom: {
      userId: ProviderAttribute.AMAZON_USER_ID,
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