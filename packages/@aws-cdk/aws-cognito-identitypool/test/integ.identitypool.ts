import {
  UserPool,
  UserPoolIdentityProviderFacebook,
  UserPoolIdentityProviderApple,
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
new UserPoolIdentityProviderFacebook(stack, 'PoolProviderFb', {
  userPool,
  clientId: '12345',
  clientSecret: '5678910',
});
new UserPoolIdentityProviderApple(stack, 'PoolProviderApple', {
  userPool,
  clientId: '54321',
  teamId: '12345',
  keyId: '13579',
  privateKey: '12abcd',
});
const otherPool = new UserPool(stack, 'OtherPool');
new UserPoolIdentityProviderFacebook(stack, 'OtherPoolProviderFb', {
  userPool: otherPool,
  clientId: '12345123',
  clientSecret: '5678910wed',
});
new UserPoolIdentityProviderApple(stack, 'OtherPoolProviderApple', {
  userPool: otherPool,
  clientId: '54321123',
  teamId: '123343',
  keyId: '13579',
  privateKey: '12abcddde',
});
const idPool = new IdentityPool(stack, 'identitypool', {
  authenticationProviders: {
    userPool: new UserPoolAuthenticationProvider({ userPool }),
    amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
    google: { clientId: '12345678012.apps.googleusercontent.com' },
  },
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