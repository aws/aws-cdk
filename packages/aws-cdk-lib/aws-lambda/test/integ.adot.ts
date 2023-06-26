import * as path from 'path';
import * as cdk from '../../core';
import * as lambda from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    new lambda.Function(this, 'MyLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.main',
      runtime: lambda.Runtime.PYTHON_3_9,
      adotInstrumentation: {
        layerVersion: lambda.AdotLayerVersion.fromPythonSdkLayerVersion(lambda.AdotLambdaLayerPythonSdkVersion.LATEST),
        execWrapper: lambda.AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });
    /// !hide
  }
}

const app = new cdk.App();

new TestStack(app, 'lambda-test-adot');

app.synth();
