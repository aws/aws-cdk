/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This function uses aws-sdk but it will not be included
    new lambda.NodejsFunction(this, 'external', {
      entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        // Will be installed, not bundled
        // (delay is a zero dependency package and its version is fixed
        // in the package.json to ensure a stable hash for this integ test)
        nodeModules: ['delay'],
        forceDockerBundling: true,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs-dependencies');
app.synth();
