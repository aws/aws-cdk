import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Fn', {
      code: lambda.Code.fromParcel(path.join(__dirname, 'parcel-handler/index.ts'), {
        minify: true,
      }),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-parcel');
app.synth();
