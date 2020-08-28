import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const projectRoot = process.env.NZM_PACKAGE_SOURCE
      ? path.join(process.env.NZM_PACKAGE_SOURCE, '..', '..', '..')
      : undefined;
    const testRoot = process.env.NZM_PACKAGE_SOURCE
      ? path.join(process.env.NZM_PACKAGE_SOURCE, 'test')
      : __dirname;

    new lambda.NodejsFunction(this, 'ts-handler', {
      projectRoot,
      entry: path.join(testRoot, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_12_X,
      minify: true,
    });

    new lambda.NodejsFunction(this, 'js-handler', {
      projectRoot,
      entry: path.join(testRoot, 'integ-handlers/js-handler.js'),
      runtime: Runtime.NODEJS_12_X,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
