import * as os from 'os';
import * as path from 'path';
import { Vpc } from '@aws-cdk/aws-ec2';
import { LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { Aws, App, Stack, StackProps } from '@aws-cdk/core';
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

    new lambda.NodejsFunction(this, 'ts-handler-custom-handler-no-dots', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
      },
      handler: 'handler',
    });

    new lambda.NodejsFunction(this, 'ts-handler-custom-handler-dots', {
      entry: path.join(__dirname, 'integ-handlers/ts-web-handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        commandHooks: {
          beforeBundling: () => [],
          beforeInstall: () => [],
          afterBundling: (_inputDir, outputDir) => [
            `${os.platform() === 'win32' ? 'copy' : 'cp'} ${path.join(
              __dirname,
              'integ-handlers',
              'ts-web-run.sh',
            )} ${outputDir}`,
          ],
        },
      },
      handler: 'ts-web.run.sh',
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          'lambda-adapter-layer',
          `arn:aws:lambda:${Aws.REGION}:753240598075:layer:LambdaAdapterLayerX86:13`,
        ),
      ],
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
