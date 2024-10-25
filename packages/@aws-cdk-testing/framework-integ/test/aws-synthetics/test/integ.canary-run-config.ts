import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new synthetics.Canary(this, 'Canary', {
      canaryName: 'next',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      cleanup: synthetics.Cleanup.LAMBDA,
      activeTracing: true,
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
    });
  }
}

const app = new App();

new IntegTest(app, 'cdk-integ-synthetics-canary-run-config', {
  testCases: [new TestStack(app, 'cdk-synthetics-canary-run-config')],
});
