import { Role, AnyPrincipal, Effect } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { IdentityPool } from '../lib/identity-pool';
import { UserPool } from '../lib/user-pool';

const app = new App();
const stack = new Stack(app, 'integ-identity-pool');
const streamRole = new Role(stack, 'streamRole', {
  assumedBy: new AnyPrincipal(),
});

const pool = new UserPool(stack, 'Pool');
const otherPool = new UserPool(stack, 'OtherPool');
const userPools = [{
  userPool: pool,
},
{
  userPool: otherPool,
}];

new IdentityPool(stack, 'identitypool', {
  userPermissions: [
    {
      effect: Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*'],
    },
  ],
  guestPermissions: [
    {
      effect: Effect.ALLOW,
      actions: ['dynamodb:Get*'],
      resources: ['*'],
    },
  ],
  authenticationProviders: {
    userPools,
    amazon: { appId: 'amzn1.application.12312k3j234j13rjiwuenf' },
    google: { appId: '12345678012.apps.googleusercontent.com' },
  },
  allowClassicFlow: true,
  identityPoolName: 'my-id-pool',
  streamOptions: {
    streamName: 'my-stream',
    enableStreamingStatus: true,
    role: streamRole,
  },
  syncTrigger: new Function(stack, 'NewFunction', {
    runtime: Runtime.NODEJS_12_X,
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = e => e'),
  }),
});
app.synth();