import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Bundler, NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Test basic rolldown bundling
    new NodejsFunction(this, 'rolldown-handler', {
      entry: path.join(__dirname, 'integ-handlers/rolldown-handler.ts'),
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        bundler: Bundler.ROLLDOWN,
        minify: true,
        sourceMap: true,
      },
    });

    // Test rolldown with externals
    new NodejsFunction(this, 'rolldown-handler-externals', {
      entry: path.join(__dirname, 'integ-handlers/rolldown-handler.ts'),
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        bundler: Bundler.ROLLDOWN,
        externalModules: ['@aws-sdk/client-s3'],
        minify: false,
      },
    });

    // Test rolldown with ESM format
    new NodejsFunction(this, 'rolldown-handler-esm', {
      entry: path.join(__dirname, 'integ-handlers/rolldown-handler.ts'),
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        bundler: Bundler.ROLLDOWN,
        format: OutputFormat.ESM,
        minify: true,
      },
    });

    // Test rolldown with custom args
    new NodejsFunction(this, 'rolldown-handler-custom-args', {
      entry: path.join(__dirname, 'integ-handlers/rolldown-handler.ts'),
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        bundler: Bundler.ROLLDOWN,
        rolldownArgs: {
          '--log-level': 'info',
        },
        define: {
          'process.env.CUSTOM_VAR': JSON.stringify('rolldown-test'),
        },
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-rolldown');

new integ.IntegTest(app, 'RolldownTest', {
  testCases: [stack],
});

app.synth();

