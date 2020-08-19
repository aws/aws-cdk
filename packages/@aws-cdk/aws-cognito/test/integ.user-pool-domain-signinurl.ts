import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

/*
 * Stack verification steps:
 * * Run the command `curl -sS -D - '<stack output SignInUrl>' -o /dev/null` should return HTTP/2 200.
 * * It didn't work if it returns 302 or 400.
 */

const app = new App();
const stack = new Stack(app, 'integ-user-pool-domain-signinurl');

const userpool = new UserPool(stack, 'UserPool');

const domain = userpool.addDomain('Domain', {
  cognitoDomain: {
    domainPrefix: 'cdk-integ-user-pool-domain',
  },
});

const client = userpool.addClient('UserPoolClient', {
  oAuth: {
    callbackUrls: ['https://example.com'],
  },
});

new CfnOutput(stack, 'SignInUrl', {
  value: domain.signInUrl(client, {
    redirectUri: 'https://example.com',
  }),
});