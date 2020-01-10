import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, 'handler-ts');
    new lambda.NodejsFunction(this, 'handler-js');
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
