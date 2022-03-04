import * as path from 'path';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, 'esm', {
      entry: path.join(__dirname, 'integ-handlers/esm.ts'),
      bundling: {
        format: lambda.OutputFormat.ESM,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs-esm');
app.synth();
