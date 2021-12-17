import {
  UserPool,
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
const otherPool = new UserPool(stack, 'OtherPool');

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