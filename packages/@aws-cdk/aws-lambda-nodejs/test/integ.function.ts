/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, 'ts-handler', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_12_X,
      bundling: { minify: true },
    });

    new lambda.NodejsFunction(this, 'js-handler', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      runtime: Runtime.NODEJS_12_X,
    });

    new lambda.NodejsFunction(this, 'ts-handler-vpc', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_12_X,
      vpc: new Vpc(this, 'Vpc'),
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
