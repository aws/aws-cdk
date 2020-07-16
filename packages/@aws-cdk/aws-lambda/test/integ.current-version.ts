import * as path from 'path';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as lambda from '../lib';

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

const app = new App();

new TestStack(app, 'lambda-test-current-version');

app.synth();
