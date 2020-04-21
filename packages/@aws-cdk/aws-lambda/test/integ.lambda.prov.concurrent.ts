import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-pce-1');

const lambdaCode = 'exports.handler =  async function(event, context) { ' +
                   'console.log("Hello from CDK! with #type# Provisioned Concurrent Exec!");}';

const pce = 5;

// Integration test for provisioned concurrent execution via Alias
const fn = new lambda.Function(stack, 'MyLambdaAliasPCE', {
  code: new lambda.InlineCode(lambdaCode.replace('#type#', 'Alias')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

fn.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));

const version = fn.addVersion('1');

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
  provisionedConcurrentExecutions: pce,
});

alias.addPermission('AliasPermission', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});

// Integration test for provisioned concurrent execution via Version
const fnVersionPCE = new lambda.Function(stack, 'MyLambdaVersionPCE', {
  code: new lambda.InlineCode(lambdaCode.replace('#type#', 'Version')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

fnVersionPCE.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));

const version2 = fnVersionPCE.addVersion('2', undefined, undefined, pce);

const alias2 = new lambda.Alias(stack, 'Alias2', {
  aliasName: 'prod',
  version: version2,
});

alias2.addPermission('AliasPermission2', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});

app.synth();
