/// !cdk-integ *
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
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
      },
    });

    new lambda.NodejsFunction(this, 'js-handler', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      runtime: Runtime.NODEJS_14_X,
    });

    new lambda.NodejsFunction(this, 'ts-handler-vpc', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      vpc: new Vpc(this, 'Vpc'),
    });

    new lambda.NodejsEdgeFunction(this, 'ts-handler-edge', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
      },
    });

    new lambda.NodejsEdgeFunction(this, 'js-handler-edge', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      runtime: Runtime.NODEJS_14_X,
    });
  }
}

const app = new App();
const region = 'eu-west-1';
new TestStack(app, 'cdk-integ-lambda-nodejs', { env: { region: region } });
app.synth();
