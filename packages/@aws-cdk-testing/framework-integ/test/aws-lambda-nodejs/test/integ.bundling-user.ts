import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App();
const stack = new Stack(app, 'cdk-integ-bundling-lambda-nodejs');

new lambda.NodejsFunction(stack, 'ts-decorator-handler-root-user', {
  entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
  bundling: {
    forceDockerBundling: true,
    commandHooks: {
      beforeBundling(_inputDir: string, _outputDir: string): string[] {
        return [
          'cat /etc/os-release',
        ];
      },
      beforeInstall: function (_inputDir: string, _outputDir: string): string[] {
        return ['id'];
      },
      afterBundling: function (_inputDir: string, _outputDir: string): string[] {
        return ['mkdir test'];
      },
    },
  },
  runtime: STANDARD_NODEJS_RUNTIME,
});

new IntegTest(app, 'BundlingUserTest', {
  testCases: [stack],
});
