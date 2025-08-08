import * as path from 'path';
import { Aspects, App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';
import * as lambda from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'MyLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
      handler: 'index.main',
      runtime: lambda.Runtime.PYTHON_3_8,
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
        retryAttempts: 1,
      },
    });

    handler.currentVersion.addAlias('live');
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new TestStack(app, 'lambda-test-current-version');

// Changes the function description when the feature flag is present
// to validate the changed function hash.
Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));

app.synth();
