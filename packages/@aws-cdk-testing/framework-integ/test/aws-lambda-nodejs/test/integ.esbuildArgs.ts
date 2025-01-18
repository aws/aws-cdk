import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // assert that beforeBundling/afterBundling are called only once
    let beforeBundlingCallCount = 0;
    let afterBundlingCallCount = 0;

    new lambda.NodejsFunction(this, 'ts-handler', {
      entry: path.join(__dirname, 'integ-handlers/ts-handler.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: lambda.SourceMapMode.BOTH,
        esbuildArgs: {
          '--log-limit': '0',
          '--out-extension': '.js=.mjs',
        },
        commandHooks: {
          beforeBundling() {
            if (1 < beforeBundlingCallCount) {
              throw new Error('afterBundling should called only once');
            }
            beforeBundlingCallCount++;
            return [];
          },
          afterBundling() {
            if (1 < afterBundlingCallCount) {
              throw new Error('afterBundling should called only once');
            }
            afterBundlingCallCount++;
            return [];
          },
          beforeInstall() {
            return [];
          },
        },
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-nodejs-esbuildArgs');

new IntegTest(app, 'LambdaNodeJsEsbuildArgsInteg', {
  testCases: [stack],
});
