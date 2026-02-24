import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderOidc } from 'aws-cdk-lib/aws-cognito';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'cdk' sign in link shows up.
 */

const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-oidc');

const userpool = new UserPool(stack, 'pool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const secret = new Secret(stack, 'OidcClientSecretValue', {
  secretName: 'OidcClientSecretValueName',
  generateSecretString: {
    excludePunctuation: true,
    passwordLength: 20,
  },
});

const clientSecret = Secret.fromSecretAttributes(stack, 'OidcClientSecretResolvedValue', {
  secretCompleteArn: secret.secretArn,
}).secretValue;

new UserPoolIdentityProviderOidc(stack, 'provider-with-secret-value', {
  userPool: userpool,
  name: 'provider-with-secret-value',
  clientId: 'client-id',
  clientSecretValue: clientSecret,
  issuerUrl: 'https://www.issuer-url.com',
  endpoints: {
    authorization: 'https://www.issuer-url.com/authorize',
    token: 'https://www.issuer-url.com/token',
    userInfo: 'https://www.issuer-url.com/userinfo',
    jwksUri: 'https://www.issuer-url.com/jwks',
  },
  scopes: ['openid', 'phone'],
  attributeMapping: {
    phoneNumber: ProviderAttribute.other('phone_number'),
    emailVerified: ProviderAttribute.other('email_verified'),
  },
});

new UserPoolIdentityProviderOidc(stack, 'provider-with-secret-string', {
  userPool: userpool,
  name: 'provider-with-secret-string',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  issuerUrl: 'https://www.issuer-url.com',
  endpoints: {
    authorization: 'https://www.issuer-url.com/authorize',
    token: 'https://www.issuer-url.com/token',
    userInfo: 'https://www.issuer-url.com/userinfo',
    jwksUri: 'https://www.issuer-url.com/jwks',
  },
  scopes: ['openid', 'phone'],
  attributeMapping: {
    phoneNumber: ProviderAttribute.other('phone_number'),
    emailVerified: ProviderAttribute.other('email_verified'),
  },
});

const client = userpool.addClient('client');

const domain = userpool.addDomain('domain', {
  cognitoDomain: {
    domainPrefix: 'cdk-test-pool',
  },
});

new CfnOutput(stack, 'SignInLink', {
  value: domain.signInUrl(client, {
    redirectUri: 'https://example.com',
  }),
});
