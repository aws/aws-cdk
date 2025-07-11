import * as os from 'os';
import * as path from 'path';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Aws, App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, 'ts-handler', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
      },
    });

    new lambda.NodejsFunction(this, 'ts-handler-log-level', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        logLevel: lambda.LogLevel.VERBOSE,
      },
    });

    new lambda.NodejsFunction(this, 'js-handler', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    new lambda.NodejsFunction(this, 'js-handler-bundling-path', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      bundling: {
        inject: [path.join(__dirname, 'whitespace path/shim.js')],
      },
    });

    new lambda.NodejsFunction(this, 'js-handler-tsconfig-path', {
      entry: path.join(__dirname, 'integ-handlers/js-handler.js'),
      bundling: {
        tsconfig: path.join(__dirname, 'whitespace path/tsconfig.json'),
      },
    });

    new lambda.NodejsFunction(this, 'ts-handler-metafile-path', {
      entry: path.join(__dirname, 'integ-handlers/whitespace path/ts-handler.ts'),
      bundling: {
        metafile: true,
      },
    });

    new lambda.NodejsFunction(this, 'ts-handler-vpc', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      vpc: new Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false }),
    });

    new lambda.NodejsFunction(this, 'ts-handler-custom-handler-no-dots', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
      },
      handler: 'handler',
    });

    new lambda.NodejsFunction(this, 'ts-handler-custom-handler-dots', {
      entry: path.join(__dirname, 'integ-handlers/ts-web-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
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

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new TestStack(app, 'cdk-integ-lambda-nodejs');
app.synth();
