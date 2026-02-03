import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderOidc } from 'aws-cdk-lib/aws-cognito';

/*
 * Stack verification steps
 * * Visit the URL provided by stack output 'SignInLink' in a browser, and verify the 'cdk' sign in link shows up.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-idp-google');

const userpool = new UserPool(stack, 'pool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new UserPoolIdentityProviderOidc(stack, 'cdk', {
  userPool: userpool,
  name: 'cdk',
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
