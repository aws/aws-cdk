import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // This function uses 'aws-sdk' but it will not be bundled.
    new lambda.NodejsFunction(this, 'Function', {
      entry: path.join(__dirname, 'integ-handlers/external-handler.ts'),
      runtime: Runtime.NODEJS_12_X,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs-external');
app.synth();
