import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, 'ts-decorator-handler', {
      entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        preCompilation: true,
      },
      runtime: Runtime.NODEJS_14_X,
    });

    new lambda.NodejsFunction(this, 'ts-decorator-handler-tsconfig', {
      entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        tsconfig: path.join(__dirname, '..', 'tsconfig.json'),
        preCompilation: true,
      },
      runtime: Runtime.NODEJS_14_X,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-compilations-lambda-nodejs');
app.synth();
