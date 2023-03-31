import * as path from 'path';
import * as cdk from '../../core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-layer-version-1');

// Just for the example - granting to the current account is not necessary.
const awsAccountId = stack.account;

/// !show
const layer = new lambda.LayerVersion(stack, 'MyLayer', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
  compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
  license: 'Apache-2.0',
  description: 'A layer to test the L2 construct',
});

// To grant usage by other AWS accounts
layer.addPermission('remote-account-grant', { accountId: awsAccountId });

// To grant usage to all accounts in some AWS Ogranization
// layer.grantUsage({ accountId: '*', organizationId });

new lambda.Function(stack, 'MyLayeredLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  layers: [layer],
});
/// !hide

app.synth();
