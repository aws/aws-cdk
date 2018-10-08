import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS610,
});

fn.addToRolePolicy(new iam.PolicyStatement().addAllResources().addAction('*'));

const version = fn.addVersion('1');

new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});

app.run();
