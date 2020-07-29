import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Imports');

const baseFunc = new lambda.Function(stack, 'BaseFunction', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const iFunc = lambda.Function.fromFunctionAttributes(stack, 'iFunc', {
  functionArn: baseFunc.functionArn,
});

iFunc.addPermission('iFunc', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});

const iVersionFunc = lambda.Version.fromVersionAttributes(stack, 'iVersionFunc', {
  version: baseFunc.latestVersion.version,
  lambda: baseFunc,
});

iVersionFunc.addPermission('iVersionFunc', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});

app.synth();