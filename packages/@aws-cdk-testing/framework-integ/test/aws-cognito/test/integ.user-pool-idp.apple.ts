import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderApple } from 'aws-cdk-lib/aws-cognito';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'Sign In With Apple' link shows up.
 * * If you plug in valid 'Sign In With Apple' credentials, the federated log in should work.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-apple');

const userpool = new UserPool(stack, 'pool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new UserPoolIdentityProviderApple(stack, 'apple', {
  userPool: userpool,
  clientId: 'com.amzn.cdk',
  teamId: 'CDKTEAMCDK',
  keyId: 'CDKKEYCDK1',
  privateKey: 'PRIV_KEY_CDK',
  scopes: ['email', 'name'],
  attributeMapping: {
    familyName: ProviderAttribute.APPLE_LAST_NAME,
    givenName: ProviderAttribute.APPLE_FIRST_NAME,
    emailVerified: ProviderAttribute.APPLE_EMAIL_VERIFIED,
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
