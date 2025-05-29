import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

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
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    new lambda.NodejsFunction(this, 'ts-decorator-handler-tsconfig', {
      entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        tsconfig: path.join(__dirname, '..', 'tsconfig-custom.json'),
        preCompilation: true,
      },
      runtime: STANDARD_NODEJS_RUNTIME,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new TestStack(app, 'cdk-integ-compilations-lambda-nodejs');
app.synth();
