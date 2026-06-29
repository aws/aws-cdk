import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

fn.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));
fn.addFunctionUrl();

const version = fn.currentVersion;

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});
alias.addPermission('AliasPermission', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});
alias.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});

// Changes the function description when the feature flag is present
// to validate the changed function hash.
cdk.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));

new lambda.Function(stack, 'MySnapStartLambda', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'handler-snapstart.zip')),
  handler: 'example.Handler::handleRequest',
  runtime: lambda.Runtime.JAVA_11,
  snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new lambda.Function(stack, 'MySnapStartLambdaArm', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'handler-snapstart.zip')),
  handler: 'example.Handler::handleRequest',
  runtime: lambda.Runtime.JAVA_21,
  architecture: lambda.Architecture.ARM_64,
  snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
});

app.synth();
