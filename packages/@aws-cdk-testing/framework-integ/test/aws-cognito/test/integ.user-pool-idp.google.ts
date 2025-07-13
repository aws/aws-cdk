import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderGoogle } from 'aws-cdk-lib/aws-cognito';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'Google' sign in link shows up.
 * * If you plug in valid 'Google' credentials, the federated log in should work.
 */

const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-google');

const userpool = new UserPool(stack, 'pool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const secret = new Secret(stack, 'GoogleClientSecretValue', {
  secretName: 'GoogleClientSecretValueName',
  generateSecretString: {
    excludePunctuation: true,
    passwordLength: 20,
  },
});

const clientSecret = Secret.fromSecretAttributes(stack, 'GoogleClientSecretValue2', {
  secretCompleteArn: secret.secretArn,
}).secretValue;

new UserPoolIdentityProviderGoogle(stack, 'google', {
  userPool: userpool,
  clientId: 'google-client-id',
  clientSecretValue: clientSecret,
  attributeMapping: {
    givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
    familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
    email: ProviderAttribute.GOOGLE_EMAIL,
    emailVerified: ProviderAttribute.GOOGLE_EMAIL_VERIFIED,
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
