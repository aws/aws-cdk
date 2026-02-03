import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-pce-1');

const lambdaCode = 'exports.handler =  async function(event, context) { ' +
                   'console.log("Hello from CDK! with #type# Provisioned Concurrent Exec!");}';

const pce = 5;

// Integration test for provisioned concurrent execution via Alias
const fn = new lambda.Function(stack, 'MyLambdaAliasPCE', {
  code: new lambda.InlineCode(lambdaCode.replace('#type#', 'Alias')),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

fn.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));

const version = fn.currentVersion;

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
  runtime: STANDARD_NODEJS_RUNTIME,
  currentVersionOptions: {
    provisionedConcurrentExecutions: pce,
  },
});

fnVersionPCE.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));

const version2 = fnVersionPCE.currentVersion;

const alias2 = new lambda.Alias(stack, 'Alias2', {
  aliasName: 'prod',
  version: version2,
});

alias2.addPermission('AliasPermission2', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});

// Changes the function description when the feature flag is present
// to validate the changed function hash.
cdk.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));

app.synth();
