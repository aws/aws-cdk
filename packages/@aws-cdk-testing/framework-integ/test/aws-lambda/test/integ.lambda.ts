import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestLambdaFunction extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const fn = new lambda.Function(this, 'MyLambda', {
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

    const alias = new lambda.Alias(this, 'Alias', {
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
    cdk.Aspects.of(this).add(new lambda.FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));

    new lambda.Function(this, 'MySnapStartLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'handler-snapstart.zip')),
      handler: 'example.Handler::handleRequest',
      runtime: lambda.Runtime.JAVA_11,
      snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
    });

    new lambda.Function(this, 'MySnapStartLambdaArm', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'handler-snapstart.zip')),
      handler: 'example.Handler::handleRequest',
      runtime: lambda.Runtime.JAVA_21,
      architecture: lambda.Architecture.ARM_64,
      snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
    });
  }
}

const testingStack = new TestLambdaFunction(app, 'aws-cdk-lambda-1');
new IntegTest(app, 'TestLambdaFunctionTesting', {
  testCases: [testingStack],
});
app.synth();
