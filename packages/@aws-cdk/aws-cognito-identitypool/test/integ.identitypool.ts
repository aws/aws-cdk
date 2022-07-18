import {
  UserPool,
  UserPoolIdentityProviderGoogle,
  UserPoolIdentityProviderAmazon,
  ProviderAttribute,
} from '@aws-cdk/aws-cognito';
import {
  Effect,
  PolicyStatement,
} from '@aws-cdk/aws-iam';
import {
  App,
  Stack,
} from '@aws-cdk/core';
import {
  IdentityPool,
} from '../lib/identitypool';
import {
  UserPoolAuthenticationProvider,
} from '../lib/identitypool-user-pool-authentication-provider';

const app = new App();
const stack = new Stack(app, 'integ-identitypool');

const userPool = new UserPool(stack, 'Pool');
new UserPoolIdentityProviderGoogle(stack, 'PoolProviderGoogle', {
  userPool,
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
const otherPool = new UserPool(stack, 'OtherPool');
new UserPoolIdentityProviderAmazon(stack, 'OtherPoolProviderAmazon', {
  userPool: otherPool,
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
const idPool = new IdentityPool(stack, 'identitypool', {
  authenticationProviders: {
    userPools: [new UserPoolAuthenticationProvider({ userPool })],
    amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
    google: { clientId: '12345678012.apps.googleusercontent.com' },
  },
  roleMappings: [
    {
      providerUrl: IdentityPoolProviderUrl.AMAZON,
      useToken: true,
    },
    {
      mappingKey: 'theKey',
      providerUrl: IdentityPoolProviderUrl.userPool(Fn.importValue('ProviderUrl')),
      useToken: true,
    },
  ],
  allowClassicFlow: true,
  identityPoolName: 'my-id-pool',
});
idPool.authenticatedRole.addToPrincipalPolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['dynamodb:*'],
  resources: ['*'],
}));
idPool.unauthenticatedRole.addToPrincipalPolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['dynamodb:Get*'],
  resources: ['*'],
}));
idPool.addUserPoolAuthentication(new UserPoolAuthenticationProvider({ userPool: otherPool }));
app.synth();