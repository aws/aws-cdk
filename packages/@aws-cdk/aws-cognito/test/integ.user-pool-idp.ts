import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { UserPool, UserPoolIdentityProvider } from '../lib';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'Login with Amazon' link shows up.
 * * If you plug in valid 'Login with Amazon' credentials, the federated log in should work.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp');

const userpool = new UserPool(stack, 'pool');

const provider = UserPoolIdentityProvider.amazon(stack, 'amazon', {
  userPool: userpool,
  clientId: 'amzn-client-id',
  clientSecret: 'amzn-client-secret',
});

const client = userpool.addClient('client', {
  identityProviders: [ provider ],
});

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