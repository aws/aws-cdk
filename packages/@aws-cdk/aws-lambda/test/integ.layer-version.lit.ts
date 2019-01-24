import cdk = require('@aws-cdk/cdk');
import path = require('path');
import lambda = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-layer-version-1');

// Just for the example - granting to the current account is not necessary.
const awsAccountId = stack.accountId;

/// !show
const layer = new lambda.LayerVersion(stack, 'MyLayer', {
  code: lambda.Code.directory(path.join(__dirname, 'layer-code')),
  compatibleRuntimes: [lambda.Runtime.NodeJS810],
  license: 'Apache-2.0',
  description: 'A layer to test the L2 construct',
});

// To grant usage by other AWS accounts
layer.grantUsage('remote-account-grant', { accountId: awsAccountId });

// To grant usage to all accounts in some AWS Ogranization
// layer.grantUsage({ accountId: '*', organizationId });

new lambda.Function(stack, 'MyLayeredLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS810,
  layers: [layer],
});
/// !hide

app.run();
